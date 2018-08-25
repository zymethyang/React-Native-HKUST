import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet } from 'react-native';
import { Card, Icon, Input, Rating, Button, Item } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderDish(props) {

    const dish = props.dish;

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.content}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#0000FF'
                            onPress={() => props.onPressComment()}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }

    else {
        return (<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating style={{ flex: 1, flexDirection: 'row' }}
                    type="star"
                    imageSize={12}
                    startingValue={item.rating}
                />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            rating: 3,
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    handleComment() {
        console.log(this.state);
        this.props.postComment(this.props.navigation.getParam('dishId', ''), this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            rating: 3,
            author: '',
            comment: '',
            showModal: false
        });
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressComment={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            type="star"
                            fractions={0}
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={(value) => this.setState({ rating: value })}
                            style={{ paddingVertical: 10 }}
                        />

                        <Input
                            placeholder='Author'
                            leftIcon={
                                <Icon
                                    name='user-o'
                                    type='font-awesome'
                                    size={24}
                                    color='black'
                                />
                            }
                            value={this.state.author}
                            shake={true}
                            errorStyle={{ color: 'red' }}
                            errorMessage='Please Enter the Name of Author'
                            onChangeText={(value) => this.setState({ author: value })}
                        />

                        <Input
                            placeholder='Comment'
                            leftIcon={
                                <Icon
                                    name='comment-o'
                                    type='font-awesome'
                                    size={24}
                                    color='black'
                                />
                            }
                            value={this.state.comment}
                            shake={true}
                            errorStyle={{ color: 'red' }}
                            errorMessage='Please Enter the Comment'
                            onChangeText={(value) => this.setState({ comment: value })}
                        />

                        <Button
                            onPress={() => { this.handleComment(); this.resetForm(); }}
                            buttonStyle={{
                                backgroundColor: "#512DA8",
                                borderColor: "transparent",
                            }}
                            title="SUBMIT"
                        />

                        <Button
                            onPress={() => { this.toggleModal(); this.resetForm(); }}
                            buttonStyle={{
                                backgroundColor: "#C0C0C0",
                                borderColor: "transparent",
                            }}
                            containerStyle={{ marginTop: 20 }}
                            title="CANCEL"
                        />
                    </View>
                </Modal>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);