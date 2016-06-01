import React, {Component, PropTypes} from 'react';
import Picker from 'react-mobile-picker';

export default class SortablePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueGroups: {
        vehicle: {description: 'A 180 Urban Autom PTS', registration: '09/2013', mileage: '31.000 km', price: '18480 €'}
      }, 
      optionGroups: {
        vehicle: [
          {description: 'A 180 Urban Autom PTS', registration: '09/2013', mileage: '31.000 km', price: '18480 €'},
          {description: 'A 180 Style Navi', registration: '02/2015', mileage: '8.000 km', price: '19500 €'},
          {description: 'A 180 Pano', registration: '03/2013', mileage: '24.000 km', price: '19500 €'},
          {description: 'A 180 Urban Navi', registration: '12/2014', mileage: '18.000 km', price: '19555 €'},
          {description: 'A 200 CDI', registration: '02/2013', mileage: '55700 km', price: '19980 €'},
          {description: 'A 180 Urban Xenon Navi', registration: '02/2015', mileage: '16.000 km', price: '20900 €'},
        ],
      },
      itemHeaders: {
        description: 'Description', 
        registration: 'Registration', 
        mileage: 'Mileage', 
        price: 'Price'
      },
      sortBy: {price: 'asc'}
    };
  }

  handleChange = (name, value) => {
    this.setState(({valueGroups}) => ({
      valueGroups: {
        ...valueGroups,
        [name]: value
      }
    }));
  };

  render() {
    const {optionGroups, valueGroups, itemHeaders, sortBy} = this.state;

    return (
      <div className="example-container">
        <div className="weui_cells_title">3. As a sortable column picker</div>
        <div className="weui_cells">
          <div className="weui_cell">
            <div className="weui_cell_bd weui_cell_primary"></div>
          </div>
        </div>
        <div className="picker-inline-container">
          <Picker
            optionGroups={optionGroups}
            valueGroups={valueGroups}
            onChange={this.handleChange}
            itemHeaders={itemHeaders}
            sortBy={sortBy} />
        </div>
      </div>
    );
  }
}
