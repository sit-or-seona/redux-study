# API Reference - State

<br>

# atom(options)

- Recoil의 state를 표현
- writable한 `RecoilState` 객체를 반환

```js
function atom<T>({
  key: string,
  default: T | Promise<T> | RecoilValue<T>,

  effects_UNSTABLE?: $ReadOnlyArray<AtomEffect<T>>,

  dangerouslyAllowMutability?: boolean,
}): RecoilState<T>
```

### 속성

- key
  - 내부적으로 atom을 식별하는데 사용되는 고유한 문자열
  - 어플리케이션 전체에서 고유해야 함
- default
  - atom의 초기값
  - 그외 초기값과 동일한 타입의 atom이나 selector (ex. `Promise`, `Lodable`, wrapped value 등)
  - default 값에 selector를 작성할 경우, atom이 default selector가 업데이트할 때마다 동적으로 업데이트
  - default 값이 없거나, null/undefined일 경우, atom이 pending 상태로 시작되고 설정될 때까지 Suspense가 트리거됨
  - default 값에 `Promise`, `Lodable`, 함수 등을 wrapping하지 않고 직접 설정하려면 `atom.value()`로 wrapping 가능
- effects
  - Atom Effects의 배열 (optianal)
- dangerouslyAllowMutability
  - 몇몇 상황에서 atoms에 저장된 객체를 mutating하는 걸 허용하기 위해 사용 (state 변화 X)
  - 개발 환경에서 freezing 객체를 오버라이딩하기 위해 사용하는 옵션

### 가장 많이 사용되는 Hooks

|        hook         |                          설명                          |
| :-----------------: | :----------------------------------------------------: |
|   useRecoilState    | atom을 읽고 쓰기 위해 사용 <br> atom에 컴포넌트를 등록 |
|   useRecoilValue    |  atom을 읽기만 할 때 사용 <br> atom에 컴포넌트를 등록  |
|  useSetRecoilState  |                atom에 쓰기만 할 때 사용                |
| useResetRecoilState |        atom을 default value로 초기화할 때 사용         |

- 드문 케이스로 컴포넌트를 등록하지 않고 atom의 값을 읽기 위해서 `useRecoilCallback`을 참조

- atom을 초기화하기 위해 정적 값외의 같은 타입의 Promise, RecoilValue를 사용 가능
- Promise가 pending 상태이거나 default selector가 비동기일 수 있기 때문에 atom 값도 pending이거나 읽는 중에 에러 발생 가능
- **atom을 설정할 때 현재 Promise를 할당 불가능하기 때문에 비동기 함수로 selectors를 사용할 것**

- atom은 Promise나 RecoilValue를 직접 저장하는 데 사용 불가능하지만 객체 안에 포함 가능
- **Promise는 가변적**
- atom을 (순수)함수로 설정 가능하지만 setters의 업데이터 폼을 사용해야 할 수 있음 (ex. `set(myAtom, () => myFunc)`)

### 예시

```js
import { atom, useRecoilState } from "recoil";

const counter = atom({
  key: "myCounter",
  default: 0,
});

function Counter() {
  const [count, setCount] = useRecoilState(counter);
  const incrementByOne = () => setCount(count + 1);

  return (
    <div>
      Count: {count}
      <br />
      <button onClick={incrementByOne}>Increment</button>
    </div>
  );
}
```

<br>

---

<br>

# selector(options)

- 함수나 파생된 state
- 항상 동일한 값을 반환하는 **순수함수**
- `get` 함수만 제공될 경우: 읽기만 가능한 `RecoilValueReadOnly` 객체를 반환
- `set` 함수도 제공될 경우: 쓰기 가능한 `RecoilState` 객체를 반환

  ```js
  function selector<T>({
  key: string,

  get: ({
    get: GetRecoilValue
  }) => T | Promise<T> | RecoilValue<T>,

  set?: (
    {
      get: GetRecoilValue,
      set: SetRecoilState,
      reset: ResetRecoilState,
    },
    newValue: T | DefaultValue,
  ) => void,

  dangerouslyAllowMutability?: boolean,
  })
  ```

  ```js
  type ValueOrUpdater<T> =
    | T
    | DefaultValue
    | ((prevValue: T) => T | DefaultValue);
  type GetRecoilValue = <T>(RecoilValue<T>) => T;
  type SetRecoilState = <T>(RecoilState<T>, ValueOrUpdater<T>) => void;
  type ResetRecoilState = <T>(RecoilState<T>) => void;
  ```

### 속성

- key
  - 내부적으로 atom을 식별하는데 사용되는 고유한 문자열
  - 어플리케이션 전체에서 고유해야 함
- get
  - 파생된 state의 값을 평가하는 함수
  - 값을 직접 반환하거나 비동기적인 `Promise`나 같은 타입의 다른 atoms/selectors를 반환 가능
  - 첫 번째 파라미터로 `get`을 포함한 객체를 전달
    - `get`
      - 다른 atoms/selectors에서 값을 찾는데 사용되는 함수
      - 이 함수에 전달되는 모든 atoms/selectors는 selector의 dependencies에 추가됨
    - `getCallback`
      - 콜백 인터페이스로 Recoil-aware 콜백을 생성하는 함수
- set?
  - set 프로퍼티를 작성할 경우, selector는 쓰기 가능한 state를 반환
  - 첫 번째 파라미터로 콜백 객체와 새 입력 값(새 입력 값의 타입: 제네릭 또는 DefaultValue의 타입)
  - 콜백 객체가 포함하는 값
    - `get`
      - 다른 atoms/selectors에서 값을 찾는데 사용되는 함수
      - 이 함수는 selector를 주어진 atoms/selectors에 등록하지 않음
    - `set`
      - 상위 Recoil state의 값을 설정하는데 사용되는 함수
      - 첫 번째 파라미터는 Recoil state, 두 번째 파라미터는 새 값
        - 새 값: 업데이터 함수이거나 초기화하기 위한 `DefaultValue`객체
    - `reset`
      - 상위의 Recoil state를 default 값으로 초기화하는데 사용되는 함수
      - 유일한 파라미터는 Recoil state
- `dangerouslyAllowMutability`
  - 몇몇 상황에서 atoms에 저장된 객체를 mutating하는 걸 허용하기 위해 사용 (state 변화 X)
  - 개발 환경에서 freezing 객체를 오버라이딩하기 위해 사용하는 옵션

### Simple Static Dependencies (정적 의존성)

```js
const mySelector = selector({
  key: "MySelector",
  get: ({ get }) => get(myAtom) * 100,
});
```

### Dynamic Dependencies (동적 의존성)

- read-only selector는 dependencies를 기준으로 selector의 값을 평가하는 `get` 메서드를 가짐
- dependencies 중 업데이트되는 값이 있다면 selector는 재평가
- selector를 평가할 때 dependencies는 실제 사용되는 atoms/selectors를 기준으로 동적으로 결정됨
- 이전 dependencies 값에 따라 다른 추가적인 dependencies를 동적으로 사용 가능
- Recoil은 selector가 현재 업데이트된 dependencies만 등록하도록 현재 data-flow 그래프를 자동으로 업데이트

```js
const toggleState = atom({ key: "Toggle", default: false });

const mySelector = selector({
  key: "MySelector",
  get: ({ get }) => {
    const toggle = get(toggleState);
    if (toggle) {
      return get(selectorA);
    } else {
      return get(selectorB);
    }
  },
});
```

### Writeable Selector

- 양방향 selector는 입력값을 파라미터로 받고, 이 파라미터를 사용해 data-flow 그래프 상의 상위로 변경 사항을 전파 가능
- 사용자가 selector를 새 값으로 설정하거나 재설정할 수 있기 때문에 입력값은 selector의 타입과 같거나 재설정하는 `DefaultValue` 객체
- 아래 코드에서 설정&재설정 작업을 통해 상위 atom으로 전달

```js
const proxySelector = selector({
  key: "ProxySelector",
  get: ({ get }) => ({ ...get(myAtom), extraField: "hi" }),
  set: ({ set }, newValue) => set(myAtom, newValue),
});
```

- 이 selector는 데이터를 변환하므로 입력값이 `DefaultValue`인지 확인

```js
const transformSelector = selector({
  key: "TransformSelector",
  get: ({ get }) => get(myAtom) * 100,
  set: ({ set }, newValue) =>
    set(myAtom, newValue instanceof DefaultValue ? newValue : newValue / 100),
});
```

### Asynchronous Selectors

- selectors는 비동기 함수를 가지고 있고, `Promise`를 출력값으로 반환

```js
import { selector, useRecoilValue } from "recoil";

const myQuery = selector({
  key: "MyDBQuery",
  get: async () => {
    const response = await fetch(getMyRequestUrl());
    return response.json();
  },
});

function QueryResults() {
  const queryResults = useRecoilValue(myQuery);

  return <div>{queryResults.foo}</div>;
}

function ResultsSection() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <QueryResults />
    </React.Suspense>
  );
}
```

<br>

---

<br>

# class Lodable

- `Lodable` 객체는 Recoil atom 또는 selector의 최신 상태를 나타냄
- 사용가능한 값을 가지고 있거나, 에러 상태이거나, 비동기 pending 상태일 수 있음

### Lodable Interface

- state
  - atom 또는 selector의 최신 상태
  - 가능한 값: `hasValue`, `hasError`, `loading`
- contents
  - `Lodable`로 표시되는 값
  - state가 `hasValue`일 경우: 실제 값
  - state가 `hasError`일 경우: Error 객체
  - state가 `loading`일 경우: 값의 `Promise` (`toPromise()`를 사용해 `Promise`를 얻을 수 있음)

### Lodable Methods (해당 API는 아직 불안정)

- getValue
  - React Suspense와 Recoil selectors의 시맨틱에 매치되는 값에 접근하기 위한 메서드
  - state가 값을 가지고 있다면 값을 리턴, error를 가지고 있다면 error, pending 상태라면 실행을 연기하거나 보류 중인 상태를 전파하기 위해 리렌더링
- toPromise
  - selector가 revolve되면 revolve될 `Promise`를 반환
  - selector가 동기적이거나 이미 revolve된 상태라면 즉시 반환
- valueMaybe
  - 가능한 경우 값을 반환하고, 그렇지 않으면 `undefined`를 반환
- valueOrThrow
  - 가능한 경우 값을 반환하고, 그렇지 않으면 Error
- map(callback)
  - Lodable의 값을 바꾸는 함수를 받아서 바뀐 값과 함께 새로운 `Lodable`을 반환
  - 콜백함수는 파라미터로 부모 Lodable의 값을 받고 새 Lodable을 위한 새 값을 반환
  - errors와 suspense도 전파 가능
  - 콜백함수는 새 값뿐 아니라 새 값의 `Promise`, `Lodable`이나 Error도 반환 가능
  - `Promise`의 경우, `.then()`과 유사

```js
function UserInfo({ userID }) {
  const userNameLoadable = useRecoilValueLoadable(userNameQuery(userID));
  switch (userNameLoadable.state) {
    case "hasValue":
      return <div>{userNameLoadable.contents}</div>;
    case "loading":
      return <div>Loading...</div>;
    case "hasError":
      throw userNameLoadable.contents;
  }
}
```

<br>

---

<br>

# useRecoilState(state)

- 첫 번째 요소는 state 값, 두 번째 요소는 state를 업데이트하는 setter 함수가 담긴 튜플을 반환하는 훅
- React 컴포넌트에서 사용하면 state가 업데이트 되었을 때 리렌더링 하도록 컴포넌트를 구독
- default value 대신 Recoil state를 아규먼트로 받는 것 외엔 React의 `useState()`와 유사

```js
function useRecoilState<T>(state: RecoilState<T>): [T, SetterOrUpdater<T>];

type SetterOrUpdater<T> = (T | (T => T)) => void;

```

### 아규먼트

- state
  - atom 또는 쓰기가능한 selector
  - 쓰기가능한 selectors: `get`과 `set`을 가지고 있는 selector

### 예시

```js
import { atom, selector, useRecoilState } from "recoil";

const tempFahrenheit = atom({
  key: "tempFahrenheit",
  default: 32,
});

const tempCelsius = selector({
  key: "tempCelsius",
  get: ({ get }) => ((get(tempFahrenheit) - 32) * 5) / 9,
  set: ({ set }, newValue) => set(tempFahrenheit, (newValue * 9) / 5 + 32),
});

function TempCelsius() {
  const [tempF, setTempF] = useRecoilState(tempFahrenheit);
  const [tempC, setTempC] = useRecoilState(tempCelsius);

  const addTenCelsius = () => setTempC(tempC + 10);
  const addTenFahrenheit = () => setTempF(tempF + 10);

  return (
    <div>
      Temp (Celsius): {tempC}
      <br />
      Temp (Fahrenheit): {tempF}
      <br />
      <button onClick={addTenCelsius}>Add 10 Celsius</button>
      <br />
      <button onClick={addTenFahrenheit}>Add 10 Fahrenheit</button>
    </div>
  );
}
```

# useRecoilValue(state)

- 주어진 Recoil state의 값을 반환하는 훅
- React 컴포넌트에서 사용하면 state가 업데이트 되었을 때 리렌더링 하도록 컴포넌트를 구독
- 읽기전용 state와 쓰기가능한 state에서 모두 동작하기 때문에 컴포넌트가 state를 읽기만 할 때 사용을 추천

```js
function useRecoilValue<T>(state: RecoilValue<T>): T;
```

### 아규먼트

- state
  - atom 또는 selector

### 예시

```js
import { atom, selector, useRecoilValue } from "recoil";

const namesState = atom({
  key: "namesState",
  default: ["", "Ella", "Chris", "", "Paul"],
});

const filteredNamesState = selector({
  key: "filteredNamesState",
  get: ({ get }) => get(namesState).filter((str) => str !== ""),
});

function NameDisplay() {
  const names = useRecoilValue(namesState);
  const filteredNames = useRecoilValue(filteredNamesState);

  return (
    <>
      Original names: {names.join(",")}
      <br />
      Filtered names: {filteredNames.join(",")}
    </>
  );
}
```
