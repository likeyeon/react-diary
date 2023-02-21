import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
import {useRef, useState} from "react";

// const dummyList = [
//   {
//     id:1,
//     author:"조하연",
//     content: "오늘의 일기1",
//     emotion: 5,
//     created_date : new Date().getTime(),
//   },
//   {
//     id:2,
//     author:"홍길동",
//     content: "오늘의 일기2",
//     emotion: 4,
//     created_date : new Date().getTime(),
//   },
//   {
//     id:3, 
//     author:"아무개",
//     content: "오늘의 일기3",
//     emotion: 3,
//     created_date : new Date().getTime(),
//   },
//   {
//     id:4,
//     author:"김민지",
//     content: "오늘의 일기4",
//     emotion: 1,
//     created_date : new Date().getTime(),
//   },
// ]

const App = () => {
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id : dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
  };

  const onRemove = (targetId) => {
    console.log(`${targetId}가 삭제되었습니다.`);
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  }

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it)=>
        it.id === targetId? {...it, content: newContent} : it
      )
    );
  }

  return (
    <div className="App">
      <DiaryEditor onCreate = {onCreate}/>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList = {data} /> 
    </div>
  );
}

export default App;
