# Core Concepts

## Overview

- Recoil을 사용하면 atoms(공유 상태)에서 selectors(순수 함수)를 거쳐 React 컴포넌트로 내려가는 data-flow graph를 생성

## Atoms

- state의 단위
- 업데이트 & 구독이 가능
- atom이 업데이트 → 구독된 컴포넌트는 새로운 값을 반영하여 리렌더링
- atoms는 런타임에서도 생성 가능
- React 로컬 컴포넌트 state로 사용 가능
- 하나의 atom을 여러 컴포넌트에서 사용할 경우, 모든 컴포넌트는 state를 공유

**atom 함수를 사용해 생성**

```js
const fontSizeState = atom({
  key: "fontSizeState",
  default: 14,
});
```

- 전역적으로 고유한 key가 필요
  - 디버깅, 유지보수, 특정 API에 사용
- React 컴포넌트 state처럼 디폴트 값을 가짐
- 컴포넌트에서 atom을 읽고 작성하기 위해 `useRecoilState` 훅을 사용
  - React의 `useState`와 유사하지만 컴포넌트 간에 공유될 수 있다는 차이가 있음

```js
// FontButton.jsx
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return (
    <button
      onClick={() => setFontSize((size) => size + 1)}
      style={{ fontSize }}
    >
      Click to Enlarge
    </button>
  );
}

// Text.jsx
function Text() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return <p style={{ fontSize }}>This text will increase in size too.</p>;
}
```

## Selectors

- atoms나 다른 selectors를 input으로 받는 순수 함수
- 상위의 atoms나 selectors가 업데이트되면, 하위의 selector 함수도 재실행
- 컴포넌트들은 selectors를 atoms처럼 구독 가능하고, selectors가 변경되면 컴포넌트들을 리렌더링
- selectors는 state를 기반으로 하는 파생 데이터를 계산하는 데 사용
  - 최소한의 state만 atoms에 저장하고, 다른 모든 파생 데이터는 selector 함수로 효율적으로 계산하기 때문에 불필요한 state 보존을 방지
- selectors는 어떤 컴포넌트가 자신을 필요로 하는지, 어떤 state가 자신에게 의존하는지 추적하기 때문에 함수적 접근방식을 효율적으로 만듦
- 컴포넌트 관점에서 보면 selectors와 atoms는 같은 인터페이스를 가지기 때문에 서로 대체 가능

**selector 함수를 사용해 정의**

```js
const fontSizeLabelState = selector({
  key: "fontSizeLabelState",
  get: ({ get }) => {
    const fontSize = get(fontSizeState);
    const unit = "px";

    return `${fontSize}${unit}`;
  },
});
```

- `get` 프로퍼티: 계산될 함수
  - atoms의 값과 `get` 아규먼트로 전달받는 selectors에 접근 가능
  - atom이나 selector에 접근할 때마다 자동으로 의존 관계가 생성되므로 참조했던 다른 atoms나 selectors가 업데이트되면 이 함수도 재실행
- `useRecoilValue()`를 사용해 읽을 수 있음

  - 아규먼트에 atom이나 selector를 입력하면 대응하는 값을 반환

**버튼 클릭 → 글꼴 크기 증가 + 현재 글꼴 크기를 반영하도록 레이블 업데이트**

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  const fontSizeLabel = useRecoilValue(fontSizeLabelState);

  return (
    <>
      <div>Current font size: ${fontSizeLabel}</div>

      <button onClick={setFontSize(fontSize + 1)} style={{ fontSize }}>
        Click to Enlarge
      </button>
    </>
  );
}
```
