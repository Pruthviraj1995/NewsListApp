import React, { useState, useEffect, useRef } from 'react';
import defaults from './default.jpeg';
import searchIcon from './search_icon.svg';
import axios from 'axios';

import './NewsList.scss';
import InfiniteScroll from './InfiniteScroll';

const PattemComponent = () => {
  const [intervalId, setIntervalId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perpage=10;
  const [totalData, setTotalData] = useState(perpage);
  const [loading, setload] = useState(false);

  const ref = useRef()
  const getNewsData = (replace) => {
    setload(true)
    console.log('getting from api')
    let searchedText = searchText
      ? `q=${searchText}&` : 'q=reactjs&';
    axios
      .get(
        "https://newsapi.org/v2/everything?" +
        searchedText +
        "apiKey=99b2dc084eae4993adf955652422c714&pageSize=10&page=" + currentPage
      ) // Keys = 45b98b787e9e4dcc85283bcd3faed095  99b2dc084eae4993adf955652422c714  6174e76354684736854d667fa514b744
      .then(res => {
        const newdata = replace ? [...res.data.articles] : [...newsData, ...res.data.articles]
        console.log(newdata)
        setNewsData(newdata);
        setTotalData(res.data.totalResults);
        setload(false)
        if(!loading && currentPage==1 && ref.current.offsetHeight===ref.current.scrollHeight){
          setCurrentPage(state=>state+1)
        }
      })
      .catch(err => console.log(err));
  }

  const handleChange = (e) => {
    const val = e.target.value
    setSearchText(val);
  }

  const refreshData = () => {
    if(!loading && !(currentPage>Math.ceil(totalData/perpage))){
      console.log(currentPage+1,totalData)
      setCurrentPage(state=>state+1)
    }

  }

  useEffect(() => {
    // setIntervalId(setInterval(() => {
    //   refreshData();
    // }, 10000));

    // return() => {
    //   clearTimeout(intervalId);
    //   console.log("asds")
    // }
    getNewsData();
    
    window.addEventListener('resize', ()=>{
      if(!loading && currentPage==1 && ref.current.offsetHeight===ref.current.scrollHeight){
        console.log('//////')
        setload(true)
        setCurrentPage(state=>state+1)
      }
    });
    
  }, []);

  useEffect(()=>{
    if(currentPage!==1){
      getNewsData();
    }
  },[currentPage]);

  useEffect(()=>{
    if(searchText){
      getNewsData(true);
    }
  },[searchText]);
  
  return (
    <InfiniteScroll loadPages={refreshData} reference={ref}>
      <div className="container">
        <div className="newsContainer">
          <div className="header">Latest News Search</div>
          <div className="searchContainer">
            <div className="searchNews">
              <input
                type="text"
                value={searchText}
                placeholder="Search News"
                className="searchbar"
                onChange={handleChange}
              />
              <img src={searchIcon} alt="" className="searchIcon" />
            </div>
            <div className="cardContainer">
              {newsData.length !== 0 ? (
                newsData.map((data, key) => (
                  <div key={key} className="newsCard">
                    <div className="img-newscard">
                      <img
                        alt=""
                        src={data.urlToImage ? data.urlToImage : defaults}
                        className="imgIcon"
                      />
                    </div>
                    <div className="content-newscard">
                      <div className="name-content"><a href={data.url} target="_blank" rel="noopener noreferrer">{data.source.name}</a></div>
                      <div className="desc-content">{data.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                  <div className='snf'>search not found</div>
                )}
            </div>
          </div>
        </div>
      </div>
    </InfiniteScroll>
  );
}

export default PattemComponent;