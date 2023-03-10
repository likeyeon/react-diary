import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
import {useRef, useEffect, useMemo, useCallback, useReducer } from "react";

const reducer = (state, action) => {
  switch(action.type){
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const created_data = new Date().getTime(); 
      const newItem = {
        ...action.data,
        created_data
      }
      return [newItem, ...state];
    }
    case 'REMOVE': {
      return state.filter((it)=>it.id !== action.targetId);
    }
    case 'EDIT': {
      return state.map((it) => it.id === action.targetId? {...it, content:action.newContent} : it);
    }
    default :
    return state; 
  }
}

const App = () => {
  // const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, [])

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0,20).map((it) => {
      return {
        author : it.email,
        content : it.body,
        emotion : Math.floor(Math.random()*5) + 1,
        created_data : new Date().getTime(),
        id : dataId.current++
      }
    })

    dispatch({type: 'INIT', data:initData})
  }

  useEffect(() => {
    getData();
  }, [])

  const onCreate = useCallback((author, content, emotion) => {

    dispatch({type: 'CREATE', data:{author, content, emotion, id:dataId.current}})

    dataId.current += 1;

  },[]);

  const onRemove = useCallback((targetId) => {

    dispatch({type : 'REMOVE', targetId})
  }, []);

  const onEdit = useCallback((targetId, newContent) => {

    dispatch({type: 'EDIT', targetId, newContent})
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      <DiaryEditor onCreate = {onCreate}/>
      <div>?????? ?????? : {data.length}</div>
      <div>?????? ?????? ?????? ?????? : {goodCount}</div>
      <div>?????? ?????? ?????? ?????? : {badCount}</div>
      <div>?????? ?????? ?????? ?????? : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList = {data} /> 
    </div>
  );
}

export default App;
