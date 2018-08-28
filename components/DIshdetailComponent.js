import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = (state) => ({
  comments: state.comments,
  dishes: state.dishes,
  favorites: state.favorites
});

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

const styles = StyleSheet.create({
  actions: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  modal: {
    padding: 15
  },
  buttons: {
    marginTop: 20
  }
});

function RenderDish(props) {
  const dish = props.dish;

  handleViewRef = ref => this.view = ref;

  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) {
      return true;
    } else {
      return false;
    }
  };

  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    return (dx > 200? true : false);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    onPanResponderGrant: () => {
      this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          'Add Favorite',
          'Are you sure you wish to add ' + dish.name + ' to favorite?',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
          ],
          { cancelable: false }
        );
      }
      
      if (recognizeComment(gestureState)) {
        props.onShowModal();
      }

      return true;
    }
  });

  if (dish != null) {
    return (
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
        ref={this.handleViewRef}
        {...panResponder.panHandlers}>
        <Card
          featuredTitle={dish.name}
          image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>
            {dish.description}
          </Text>
          <View style={styles.actions}>
            <Icon raised reverse name={props.favorite ? 'heart' : 'heart-o' } 
              type='font-awesome' color='#f50' 
              onPress={() => props.favorite ? console.log('Already favorite!') : props.onPress() } />
            <Icon raised reverse name="pencil"
              type='font-awesome' color='#512DA8'
              onPress={() => props.onShowModal() } />
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
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Rating
            readonly
            startingValue={item.rating}
            imageSize={10}
            onFinishRating={(value) => console.log(value)}
          />
        </View>
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };

  return (
    <Card title='Comments'>
       <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
       </Animatable.View>
    </Card>
  );
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      author: '',
      comment: '',
      rating: 5
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
    this.resetForm();
  }

  handleComment() {
    const dishId = this.props.navigation.getParam('dishId', '');
    const { author, comment, rating } = this.state;
    this.props.postComment(dishId, rating, author, comment);
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      author: '',
      comment: '',
      rating: 5
    });
  }

  ratingCompleted(value) {
    this.setState({ rating: value });
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
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
          onShowModal={() => this.toggleModal() }/>
        <RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.toggleModal();
          }}
          onRequestClose={() => {
            this.toggleModal();
          }}>
          <View style={styles.modal}>
            <Rating
              showRating
              startingValue={this.state.rating}
              onFinishRating={(rating) => this.ratingCompleted(rating)}
              style={{ paddingVertical: 10 }}
            />
            <Input placeholder='Author'
              value={this.state.author}
              onChangeText={(author) => this.setState({author})}
              leftIcon={{ type: 'font-awesome', name: 'user-o' }} />

            <Input placeholder='Comment'
              value={this.state.comment}
              onChangeText={(comment) => this.setState({comment})}
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }} />

            <View style={styles.buttons}>
              <Button
                onPress={() => this.handleComment()}
                title="Submit"
                color="#512DA8"/>
            </View>
            <View style={styles.buttons}>
              <Button
                onPress={() => { this.toggleModal(); }}
                color="#757575"
                title="Close" />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);