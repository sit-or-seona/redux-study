# Redux Essentials 2. Redux App Structure

## The Counter Example App

- '+' 버튼을 클릭하면 발생하는 일
  - `type`이 `"counter/increment"`인 action이 store에 디스패치
  - 디스패치되면 `state.counter.value` 필드가 업데이트
- 브라우저의 'Redux DevTools' 사용해 state 변경 내역과 디스패치한 코드를 추적 가능

## Application Contents

- key files
  - /src
    - index.js: the starting point for the app
    - App.js: the top-level React component
    - /app
      - store.js: creates the Redux store instance
  - /features
    - /counter
      - Counter.js: a React component that shows the UI for the counter feature
      - counterSlice.js: the Redux logic for the counter feature

### Creating the Redux Store

```js
// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

- Redux Toolkit의 `configureStore` 함수를 사용해 store를 생성하고, `reducer`를 아규먼트로 전달해야 함
- `configureStore` 함수를 호출할 때, 앱의 모든 reducer가 객체로 전달됨
- `features/counter/counterSlice.js` 파일: counter의 reducer 함수 로직을 export
- `{counter:counterReducer}` 전달
  - Redux state 객체의 `state.counter` 섹션을 얻고 싶고, `counterReducer` 함수가 `state.counter` 섹션의 업데이트 여부와 방법을 결정하는 역할을 담당하도록 함
- Redux를 사용하면 다양한 종류의 플러그인(middleware & enhancers)으로 store를 커스터마이징 가능
  - `configureStore`는 여러 미들웨어를 자동으로 추가
  - Redux DevTools가 컨텐츠를 검사 가능하도록 store를 설정

**Redux Slices**

- `slice`
  - 앱 내의 하나의 기능을 위한 Redux reducer 로직과 actions의 모음
  - 일반적으로 한 파일에 함께 정의

```js
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import postsReducer from "../features/posts/postsSlice";
import commentsReducer from "../features/comments/commentsSlice";

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
});
```

- 위 코드에서 `state.users`, `state.posts`, `state.comments`는 각각 Redux state의 구분된 slice
- `usersReducer`는 `state.users` slice 업데이트를 담당하기 때문에 'slice reducer' 함수라고 지칭
