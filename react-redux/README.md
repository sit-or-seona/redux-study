# React Redux

## Connect란?

- 컴포넌트들을 store에 연결
  - store로부터 state를 받아옴
- 2개의 아규먼트를 가짐
  - state와 dispatch 중에 고를 수 있기 때문
  ```js
  function mapStateToProps(state, ownProps?)
  /*
  1. state: store로부터 온 것
  2. ownProps: 컴포넌트의 props
  (react-router로부터 받은 props와 mapStateToProps에서 return한 값이 찍힘)
   */
  ```
- 컴포넌트에서 export default 뒤에 connect(빈함수) (컴포넌트)

### 1. mapStateToProps

- store로부터 state를 받아 컴포넌트에 prop으로 전달
