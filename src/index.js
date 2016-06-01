import React, {Component, PropTypes} from 'react';
import './style.less';

class PickerColumn extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    itemHeight: PropTypes.number.isRequired,
    columnHeight: PropTypes.number.isRequired,
    itemHeaders: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      sortBy: this.props.sortBy,
      sortOrder: this.props.sortOrder,
      options: this.props.options.slice(),
      ...this.computeTranslate(props)
    };
  }

  componentDidMount() {
    this.sortOptions();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isMoving) {
      return;
    }
    this.setState(this.computeTranslate(nextProps));
  }

  computeTranslate = (props) => {
    const {options, value, itemHeight, columnHeight} = props;
    let selectedIndex = options.indexOf(value);
    if (selectedIndex < 0) {
      // throw new ReferenceError();
      console.warn('Warning: "' + this.props.name+ '" doesn\'t contain an option of "' + value + '".');
      this.onValueSelected(options[0]);
      selectedIndex = 0;
    }

    return {
      scrollerTranslate: columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight - itemHeight,
      minTranslate: columnHeight / 2 - itemHeight * options.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };

  onValueSelected = (newValue) => {
    this.props.onChange(this.props.name, newValue);
  };

  handleTouchStart = (event) => {
    const startTouchY = event.targetTouches[0].pageY;
    this.setState(({scrollerTranslate}) => ({
      startTouchY,
      startScrollerTranslate: scrollerTranslate
    }));
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    const touchY = event.targetTouches[0].pageY;
    this.setState(({isMoving, startTouchY, startScrollerTranslate, minTranslate, maxTranslate}) => {
      if (!isMoving) {
        return {
          isMoving: true
        }
      }

      let nextScrollerTranslate = startScrollerTranslate + touchY - startTouchY;
      if (nextScrollerTranslate < minTranslate) {
        nextScrollerTranslate = minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8);
      } else if (nextScrollerTranslate > maxTranslate) {
        nextScrollerTranslate = maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8);
      }
      return {
        scrollerTranslate: nextScrollerTranslate
      };
    });
  };

  handleTouchEnd = (event) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0
    });
    setTimeout(() => {
      const {options, itemHeight} = this.props;
      const {scrollerTranslate, minTranslate, maxTranslate} = this.state;
      let activeIndex;
      if (scrollerTranslate > maxTranslate) {
        activeIndex = 0;
      } else if (scrollerTranslate < minTranslate) {
        activeIndex = options.length - 1;
      } else {
        activeIndex = - Math.floor((scrollerTranslate - maxTranslate) / itemHeight);
      }
      this.onValueSelected(options[activeIndex]);
    }, 0);
  };

  handleTouchCancel = (event) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState((startScrollerTranslate) => ({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      scrollerTranslate: startScrollerTranslate
    }));
  };

  handleItemClick = (option) => {
    if (option !== this.props.value) {
      this.onValueSelected(option);
    }
  };

  handleHeaderClick = (option) => {
    if (this.state.sortBy == option) {
      this.toggleSortOrder();
    } else {
      this.setState({sortBy: option, sortOrder: 'asc'});
    }

    this.sortOptions();
  }

  sortOptions = () => {
    const {sortBy, sortOrder, options} = this.state;

    if (sortBy === '') {
      const optionsCopy = this.props.options.slice();
      this.setState({options: optionsCopy});
    } else {
      const sortedOptions = this.state.options.sort( (a, b) => {
        const aCheck = a[sortBy].toUpperCase();
        const bCheck = b[sortBy].toUpperCase();
        if (aCheck < bCheck) {
          return -1;
        }
        if (aCheck > bCheck) {
          return 1;
        }
        return 0
      });
      this.setState({options: sortedOptions});
    }
  }

  headerText = (option) => {
    const {itemHeaders} = this.props;

    let sortIdentificator = '';
    if (this.state.sortBy === option && this.state.sortOrder === 'asc') {
      sortIdentificator = '\u2191';
    } else if (this.state.sortBy === option && this.state.sortOrder === 'desc') {
      sortIdentificator = '\u2193';
    }

    return `${itemHeaders[option]} ${sortIdentificator}`;
  }

  toggleSortOrder = () => {
    if (this.state.sortOrder === 'asc') {
      this.setState({sortOrder: 'desc'});
    } else if (this.state.sortOrder === 'desc') {
      this.setState({sortBy: '', sortOrder: ''});
    }
  }

  renderHeadItems() {
    const {itemHeight, itemHeaders} = this.props;
    const style = {
      height: itemHeight + 'px',
      lineHeight: itemHeight + 'px'
    };

    if (typeof itemHeaders !== 'undefined' && Object.keys(itemHeaders).length > 0) {
      return Object.keys(itemHeaders).map( (option, index) => {
        return ( 
          <div 
            key={index} 
            style={style}
            className="picker-column-head-item"
            onClick={() => this.handleHeaderClick(option)}>
            {this.headerText(option)}
          </div>
        )
      });
    }

    return (
      <div 
        style={style}
        className="picker-column-head-item">&nbsp;</div>
    );
  }

  renderHead() {
    const {options, itemHeight, itemHeaders} = this.props;
    const style = {
      height: itemHeight + 'px',
      lineHeight: itemHeight + 'px'
    };

    return (
      <div 
        style={style}
        className="picker-column-head">
        {this.renderHeadItems()}
      </div>
    );
  }

  renderSingleItem(option) {
    const {itemHeight, value} = this.props;

    const style = {
      height: itemHeight + 'px',
      lineHeight: itemHeight + 'px'
    };

    const className = `picker-item${option === value ? ' picker-item-selected' : ''}`;

    if (typeof option === 'object' && option !== null) {
      const elements = [];
      for (let o in option) {
        elements.push(option[o]);
      }

      return elements.map( (element, index) => {
        return (
          <div 
            key={index}
            className={className}
            style={style}
            onClick={() => this.handleItemClick(option)}>
            {element}
          </div>
        );
      });
    }

    return (
      <div 
        className={className}
        style={style}
        onClick={() => this.handleItemClick(option)}>
        {option}
      </div>
    );
  }

  renderItems() {
    const {itemHeight, value} = this.props;

    const style = {
      height: itemHeight + 'px',
      lineHeight: itemHeight + 'px'
    };

    return this.state.options.map((option, index) => {
      return (
        <div 
          key={index} 
          style={style}
          className="picker-item-container">
          {this.renderSingleItem(option)}
        </div>
      );
    });
  }

  render() {
    const translateString = `translate3d(0, ${this.state.scrollerTranslate}px, 0)`;
    const style = {
      MsTransform: translateString,
      MozTransform: translateString,
      OTransform: translateString,
      WebkitTransform: translateString,
      transform: translateString
    };
    if (this.state.isMoving) {
      style.transitionDuration = '0ms';
    }

    return (
      <div className="picker-column-wrapper">
        {this.renderHead()}
        <div 
          className="picker-column">
          <div
            className="picker-scroller"
            style={style}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            onTouchCancel={this.handleTouchCancel}>
            {this.renderItems()}
          </div>
        </div>
      </div>
    );
  }
}

export default class Picker extends Component {
  static propTyps = {
    optionGroups: PropTypes.object.isRequired,
    valueGroups: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    itemHeaders: PropTypes.object,
    itemHeight: PropTypes.number,
    height: PropTypes.number,
    sortBy: PropTypes.object
  };

  static defaultProps = {
    itemHeight: 36,
    height: 216,
    itemHeaders: {},
    sortBy: {}
  };

  renderInner() {
    const {optionGroups, valueGroups, itemHeight, itemHeaders, height, onChange, sortBy} = this.props;
    const highlightStyle = {
      height: itemHeight,
      marginTop: -(itemHeight/2)
    };
    const columnNodes = [];    
    const sortByName = Object.keys(sortBy)[0] || '';
    const sortOrder = sortBy[sortByName] || '';

    for (let name in optionGroups) {
      columnNodes.push(
        <PickerColumn
          key={name}
          name={name}
          options={optionGroups[name]}
          value={valueGroups[name]}
          itemHeight={itemHeight}
          columnHeight={height}
          itemHeaders={itemHeaders}
          onChange={onChange}
          sortBy={sortByName}
          sortOrder={sortOrder} />
      );
    }
    return (
      <div className="picker-inner">
        {columnNodes}
        <div className="picker-highlight" style={highlightStyle}></div>
      </div>
    );
  }

  render() {
    const style = {
      height: this.props.height
    };

    return (
      <div className="picker-container" style={style}>
        {this.renderInner()}
      </div>
    );
  }
}
