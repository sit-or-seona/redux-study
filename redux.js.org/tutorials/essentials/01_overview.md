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
