# Vanilla Redux

## 1. Store and Reducer

### Store란?

- state(변경이 일어나는 data)를 저장할 수 있는 장소
- createStore 라는 함수를 사용
- 파라미터로 reducer를 입력하지 않으면 에러 발생
- 객체로 dispatch, getState, replaceReducer, subscribe 메서드가 내장되어 있음

### Reducer란?

- data를 변경하는 **함수**
- return 값이 app의 data가 됨
- 하나의 reducer에 하나의 data
