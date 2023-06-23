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
