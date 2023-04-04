# Vanilla ToDo

## 1. State Mutation

- state는 변경하지 않음
  - 수정하는 유일한 방법은 action을 보내는 것
- **state를 mutate하면 안 됨**
  - 상태를 수정하는 것이 아닌 new state objects를 반환해야 함
  - 스프레드 연산자로 이전 데이터를 복사한 다음 새로운 값 추가

## 2. Delete ToDo

- state를 mutate하지 않기 위해 splice() 대신 filter() 메서드를 사용
  - 삭제할 ToDo만 제외한 새 배열을 반환
- 특정 ToDo를 얻기 위해 id 부여
  - Date.now()를 사용
- 한 가지 함수에 한 가지 기능을 넣기 위해 action과 dispatch 함수를 쪼개어 정의
