# API Reference - State

## atom(options)

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

### 옵션

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
  - 몇몇 상황에서 atoms에 저장된 객체를 mutating하는 걸 허용 (state 변화 X)
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
