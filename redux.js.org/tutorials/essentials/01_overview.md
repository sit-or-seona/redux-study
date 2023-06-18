# Redux Essentials 1. Redux Overview and Concepts

## What is Redux?

- Redux는 'actions'란 이벤트를 호출해 애플리케이션의 state를 관리하고 업데이트 하는 패턴이자 라이브러리
- 상태를 예측 가능한 방식으로만 업데이트할 수 있도록 하는 규칙과 함께 전체 애플리케이션에서 사용되어야 하는 state의 중앙 집중식 저장소 역할

### Why Should I Use Redux?

- 전역 state를 관리 (애플리케이션의 여러 부분에서 사용되는 state)
- Redux가 제공하는 패턴과 도구를 사용하면 state가 언제, 어디서 왜, 어떻게 업데이트되는지와 변화가 일어났을 때 애플리케이션 로직이 어떻게 되어야 하는지 쉽게 이해 가능
- 예측 가능하고 테스트 가능한 코드를 작성하도록 가이드하기 때문에 프로그램의 작동을 예측 가능

### When Should I Use Redux?

- Redux의 단점
  - 배워야 할 개념과 작성할 코드가 많음
  - 코드에 일부 간접적인 내용을 추가하고 제한사항을 따라야 함
- Redux가 유용한 경우
  - 여러 부분에서 사용하는 state의 양이 많은 경우
  - 시간이 지날수록 앱 state가 자주 업데이트 될 경우
  - state를 업데이트하는 로직이 복잡할 경우
  - 규모가 크거나 많은 사용자가 사용하는 앱일 경우

### Redux Libraries and Tools

- React-Redux
  - React 컴포넌트와 Redux store를 상호작용 하도록 만드는 패키지
- Redux Toolkit
  - Redux 로직을 작성하는 데에 권장하는 접근법
  - Redux 앱을 빌드하는 데 꼭 필요한 패키지와 함수들이 포함되어 있음
  - 제안하는 모범 사례로 구축되었기 때문에 대부분의 Redux 작업을 단순화하고, 일반적인 실수를 방지하고, 더 쉽게 작성할 수 있도록 지원
- Redux DevTools Extension
  - Redux store에 있는 state의 변경 내역을 표시
  - 디버깅 시에 유용 (`time-travel debugging`와 같은 기술이 포함됨)

## Redux Terms and Concepts

### State Management

```js
function Counter() {
  // State: a counter value
  const [counter, setCounter] = useState(0);

  // Action: code that causes an update to the state when something happens
  const increment = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };

  // View: the UI definition
  return (
    <div>
      Value: {counter} <button onClick={increment}>Increment</button>
    </div>
  );
}
```

- 위 앱의 구성

  - state: 앱을 동작하도록 만드는 실제 소스
  - view: 현재 state를 기반으로 한 UI의 선언적 설명
  - actions: 사용자 입력시 발생하는 이벤트이자 state를 업데이트하는 트리거

- → "one-way data flow"

  - state는 특정 시점의 앱 상태를 설명
  - UI는 해당 state를 기준으로 렌더링
  - 사용자가 버튼을 클릭하는 등의 상황이 발생하면 발생한 상황에 따라 state가 업데이트
  - UI가 새 state를 기준으로 리렌더링

- 문제점

  - 여러 컴포넌트가 같은 state를 공유하고 사용해야 하는 경우, 특히 그 컴포넌트들이 다른 부분에 위치할 경우에 단순성이 떨어짐
    - state 끌어올리기로 해결할 수도 있지만 항상 도움이 되진 않음

- 해결법

  - 공유 state를 컴포넌트에서 추출해 컴포넌트 트리 외부의 중앙에 배치
    - 컴포넌트 트리가 큰 **view**가 되고, 모든 컴포넌트가 state에 접근하거나 actions를 트리거 가능
  - 상태 관리와 관련된 개념을 정의 및 분리하고, view와 state 간의 독립성을 유지하는 규칙을 시행함으로써 코드에 더 많은 구조와 유지 관리 가능성을 제공

- → Redux의 기본 아이디어
  - 애플리케이션의 전역 상태를 포함하는 하나의 중앙 집중화된 장소
  - 코드가 예측 가능하도록 state를 업데이트 하는 특정 패턴

### Immutability

- mutable = changeable, immutable = **never be changed**
- JavaScript의 객체와 배열은 기본적으로 mutable

  - 객체와 배열의 내용을 변경 가능 → mutating
  - 동일한 참조값을 가지지만 내용이 변경됨
  - 값을 immutable하게 업데이트하기 위해선 기존 객체/배열을 복사해서 복사본을 수정해야 함

  ```js
  const obj = {
    a: {
      // To safely update obj.a.c, we have to copy each piece
      c: 3,
    },
    b: 2,
  };
  const obj2 = {
    // copy obj
    ...obj,
    // overwrite a
    a: {
      // copy obj.a
      ...obj.a,
      // overwrite c
      c: 42,
    },
  };

  const arr = ["a", "b"];
  // Create a new copy of arr, with "c" appended to the end
  const arr2 = arr.concat("c");

  // or, we can make a copy of the original array:
  const arr3 = arr.slice();
  // and mutate the copy:
  arr3.push("c");
  ```

- Redux는 모든 state 업데이트가 immutable하게 수행될 것으로 예상

### Terminology (용어)

**Actions**

- `type`필드가 있는 JavaScript 객체
- 애플리케이션에서 발생한 일을 설명하는 이벤트
- `type`: action의 이름 문자열
  - `domain/eventName` 형태로 주로 작성 (ex. "todos/todoAdded")
  - domain: action의 기능 또는 카테고리
  - eventName: 발생한 특정 작업
- `payload`: `type`외의 부가적인 정보를 담은 다른 필드

```js
const addTodoAction = {
  type: "todos/todoAdded",
  payload: "Buy milk",
};
```

**Action Creators**

- action 객체를 생성하고 반환하는 함수
- action 객체를 매번 작성할 필요가 없도록 일반적으로 다음과 같이 작성

```js
const addTodo = (text) => {
  return {
    type: "todos/todoAdded",
    payload: text,
  };
};
```

**Reducers**

- 현재 state와 action 객체를 전달받고, 필요한 경우 어떻게 state를 업데이트할지 결정한 후, 새로운 state를 반환하는 함수((state, action) => newState)
- **전달받은 action type에 따라 이벤트를 처리하는 이벤트 리스너**라고 생각할 수 있음
- reducer 규칙
  - state와 action 아규먼트에 따른 새 state만 계산
  - 기존 state를 수정할 수 없고, state를 복사해 복사본을 수정하는 immutable 업데이트 방식으로 해야 함
  - 비동기 로직 작업, 랜덤 값 계산, side effects 유발 작업 불가
- reducer 함수 내부 로직 단계
  - reducer가 해당 action을 신경쓰는지 체크 (if/else, switch, loops, ...)
    - O: state를 복사해서 복사본을 새로운 값으로 업데이트한 후 반환
    - X: 기존 state를 변경 없이 반환

```js
const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === "counter/increment") {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1,
    };
  }
  // otherwise return the existing state unchanged
  return state;
}
```

**Store**

- Redux 애플리케이션 state는 store라고 부르는 객체 안에서 존재
- store는 reducer를 전달하며 생성되고, 현재 state 값을 반환하는 `getState` 메서드가 내장

```js
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: counterReducer });

console.log(store.getState());
// {value: 0}
```

**Dispatch**

- store에 내장된 메서드
- state를 업데이트하는 유일한 방법은 `store.dispatch()`를 호출하고 action 객체를 전달하는 것
- store는 reducer 함수를 실행하고 새 state 값을 내부에 저장하며, `getState()`를 호출해 업데이트된 값을 검색 가능

```js
store.dispatch({ type: "counter/increment" });

console.log(store.getState());
// {value: 1}
```

- dispatching actions를 **이벤트를 트리거**하는 것이라고 생각할 수 있음

```js
const increment = () => {
  return {
    type: "counter/increment",
  };
};

store.dispatch(increment());

console.log(store.getState());
// {value: 2}
```

**Selectors**

- store의 state 값에서 특정 정보를 추출하는 함수
- 애플리케이션의 규모가 커질수록 앱의 다른 부분에서 같은 데이터를 읽는 경우가 많은데, 이때 로직이 반복되는 걸 막음

```js
const selectCounterValue = (state) => state.value;

const currentValue = selectCounterValue(store.getState());
console.log(currentValue);
// 2
```

### Redux Application Data Flow

- 위에서 언급된 ["one-way data flow"](#state-management)

- Redux의 "one-way data flow"
  - Initial setup
    - 루트 reducer 함수를 사용해 store 생성
    - store에서 루트 reducer 함수를 한 번 호출하고, 반환 값을 initial state로 저장
    - UI가 초기 렌더링 될 때, UI 컴포넌트는 Redux store의 현재 state에 접근하여 해당 데이터를 사용해 렌더링 항목을 결정하고, 이후에 state 변경 여부를 알 수 있도록 store를 구독
  - Updates
    - 사용자 버튼 클릭과 같은 일이 발생
    - Redux store에 action을 dispatch
      ```js
      dispatch({ type: "counter/increment" });
      ```
    - store는 이전 state와 현재 action으로 reducer 함수를 재실행하고, 반환 값을 새 state로 저장
    - store가 구독된 UI의 모든 부분에 store가 업데이트되었음을 알림
    - store의 데이터가 필요한 각 UI 컴포넌트는 필요한 state가 변경되었는지 확인
    - 데이터가 변경된 컴포넌트는 강제로 새 데이터와 함께 리렌더링되므로 화면이 업데이트

<img src="https://ko.redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif">
