# Vanilla ToDo

## 1. State Mutation

- state는 변경하지 않음
  - 수정하는 유일한 방법은 action을 보내는 것
- **state를 mutate하면 안 됨**
  - 상태를 수정하는 것이 아닌 new state objects를 반환해야 함
  - 스프레드 연산자로 이전 데이터를 복사한 다음 새로운 값 추가
