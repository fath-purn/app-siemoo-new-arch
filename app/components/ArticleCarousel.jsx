import {
  FlatList,
  ScrollView,
  View,
} from 'react-native';

import ItemArticle from './ItemArticle';

export default ArticleCarousel = ({data}) => {
  return (
    <View className="">
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={data}
          horizontal={true}
          renderItem={({item, index}) => (
            <ItemArticle
              item={item}
              data={data.length.toString()}
              index={index}
            />
          )}
          keyExtractor={item => item.id}
          width={200}
          className="mt-6 w-[100%]"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};
