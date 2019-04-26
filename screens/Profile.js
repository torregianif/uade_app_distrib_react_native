import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { ListItem, Rating } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import Config from '../constants/Config';
import Loader from '../components/Loader';


export default class Profile extends Component {

    constructor(){
        super();
        this.state = {
            userId: "",
            userName: "",
            userEmail: "",
            userToken: "",
            user: {},
            movies: null,
            loading: false
        }

        this.fetchData = this.fetchData.bind(this)
      

    }


    componentDidMount(){
        this.getData(this.fetchData);
    }


    getData = async (cb) => {
    
        const storageValue = await AsyncStorage.getItem('@user');
        const storageValueJson = JSON.parse(storageValue);
        if(storageValue !== null) {
          this.setState({
              userId: storageValueJson.id,
              userName: storageValueJson.name,
              userEmail: storageValueJson.email,
              userToken: storageValueJson.token,
              user: storageValueJson
            }, cb)
        }
    }

    fetchData(){
        this.setState({loading: true});
        const endpoint_back_movies = `${Config.api_url}/movie-comments`;
        fetch(endpoint_back_movies,
            {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${this.state.userToken}`
                }
            }
        ).then(
            (response) => {
                return response.json();
            }
        ).then(responseDataBack => {
            const results = responseDataBack.comments;
            var movies = [];

            let movies_titles = Object.keys(results);

                movies_titles.forEach(movie_title => {
                    let movie_comments = results[movie_title]
                    const movieComment =(
                    <View key={movie_title} style={{margin:10}}>
                        <Text 
                            style={{fontWeight:"bold", fontSize:18, color: "#00BFFF", textDecorationLine: 'underline'}}
                            //onPress={this.navigateToMovie}
                        >
                            {movie_title}
                        </Text>
                        {movie_comments.map(item => <ListItem
                            key={item.id}
                            title={item.comment}
                            subtitle={item.date}
                            rightAvatar = {<Rating startingValue={item.stars} imageSize={12} readonly/>}
                        /> )   }
                    </View>)

                    movies.push(movieComment);
                })                 


            this.setState({movies: movies, loading:false});



       });
    } 

  render() {
    
    let no_img = require ("../assets/images/face.png");
    let data = this.state.user.full_contact_data;
    let title = data ? `(${data.full_name} ${this.state.user.gender || '' } ${data.age || '' })` : this.state.user.name
    let subtitle = data ? `${ data.location || '' }` : ''
    return (
      <ScrollView style={styles.container}>
            <Loader loading={this.state.loading} />
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={ (data && data.photo)  && { uri: data.photo } || no_img }/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.state.user.name}</Text>
              <Text style={styles.email}>{this.state.user.email}</Text>
              <Text style={styles.info}>{ title }</Text>
              <Text style={styles.info}>{ subtitle }</Text>
              <Text style={styles.description}>
                
              </Text>
              
              
              
            </View>
        </View>
        <Text style={{fontWeight:"bold", fontSize:16, marginLeft:5, marginBottom:10}}>Comments:</Text>
        <View>{this.state.movies}</View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  email:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10,
    textDecorationLine: 'underline'
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  }
});