# Basic Tutorial

## Intro

- todoList 애플리케이션 제작
- 작업할 기능
  - todo 아이템 추가
  - todo 아이템 수정
  - todo 아이템 삭제
  - todo 아이템 필터링
  - 유용한 통계 표시

## Atoms

### atom

- state의 source of truth
- todoList에선 객체로 이루어진 배열
- `atom()` 함수로 생성
- 고유한 `key`와 `default` 값 작성
  ```js
  const todoListState = atom({
    key: "todoListState",
    default: [],
  });
  ```

### useRecoilValue()

- 컴포넌트에서 atom 내용을 읽기 위해 사용

  ```js
  const todoList = useRecoilValue(todoListState);
  ```

### useSetRecoilState()

- atom 내용을 업데이트 하는 setter 함수를 얻기 위해 사용

  ```js
  const setTodoList = useSetRecoilState(todoListState);
  ```

### useRecoilState()

- atom 내용을 읽고, 업데이트하고, 삭제하는 setter 함수를 얻기 위해 사용

  ```js
  const [todoList, setTodoList] = useRecoilState(todoListState);
  ```

## Selectors

### Selector

- 파생된 state(derived state)의 일부를 나타냄
  - derived state: 순수함수를 통해 업데이트한 state의 결과물
- 다른 데이터에 의존하는 동적인 데이터를 생성 가능

### todoList의 derived state

- 필터링된 todoList: 전체 todoList에서 일부 기준에 따라 필터링된 새 todoList를 생성하여 파생

  ```js
  const filteredTodoListState = selector({
    key: "filteredTodoListState",
    get: ({ get }) => {
      const filter = get(todoListFilterState);
      const list = get(todoListState);

      switch (filter) {
        case "Show Completed":
          return list.filter((item) => item.isComplete);
        case "Show Uncompleted":
          return list.filter((item) => !item.isComplete);
        default:
          return list;
      }
    },
  });
  ```

- todoList 통계: 전체 todoList에서 유용한 속성을 계산하여 파생

  ```js
  const todoListStatsState = selector({
    key: "todoListStatsState",
    get: ({ get }) => {
      const todoList = get(todoListState);
      const totalNum = todoList.length;
      const totalCompletedNum = todoList.filter(
        (item) => item.isComplete
      ).length;
      const totalUncompletedNum = totalNum - totalCompletedNum;
      const percentCompleted =
        totalNum === 0 ? 0 : totalCompletedNum / totalNum;

      return {
        totalNum,
        totalCompletedNum,
        totalUncompletedNum,
        percentCompleted,
      };
    },
  });
  ```
