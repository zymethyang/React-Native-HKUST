import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { DISHES } from '../shared/dishes';

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
            <TouchableOpacity  onPress={() => this.props.navigation.navigate('DishDetail', { dishId: item.id })}>
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    leftAvatar={{ source: require('./images/uthappizza.png') }}
                />
            </TouchableOpacity>
        );
    };
    render() {
        return (
            <FlatList
                data={this.state.dishes}
                renderItem={this.renderMenuItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    };
}

export default Menu;