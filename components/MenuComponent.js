import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';


const mapStateToProps = state => {
    return {
        dishes: state.dishes
    }
}

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES
        };
    }
    static navigationOptions = {
        title: 'Menu'
    }
    renderMenuItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DishDetail', { dishId: item.id })}>
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    imageSrc={{ uri: baseUrl + item.image}}
                />
            </TouchableOpacity>
        );
    };
    render() {
        return (
            <FlatList
                data={this.props.dishes.dishes}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    };
}

export default connect(mapStateToProps)(Menu);