# Atom Effects

**Atom Effects**

- side-effects(부수효과)를 관리하고, Recoil atoms를 동기화&초기화하는 API
- 여러 유용한 애플리케이션을 가지고 있음 (ex. state persistence(상태 지속성), state synchronization(상태 동기화), managing history(히스토리 관리), logging(로깅) 등)
- React Effects와 유사하지만 Atom Effects는 atom 정의의 일부로 정의되기 때문에 각각의 atom은 자체적인 정책을 지정&구성 가능
- Atom Effect는 다음의 정의를 따르는 함수

  ```ts
  type AtomEffect<T> = ({
    node: RecoilState<T>, // A reference to the atom itself
    storeID: StoreID, // ID for the <RecoilRoot> or Snapshot store associated with this effect.
    trigger: 'get' | 'set', // The action which triggered initialization of the atom

    // Callbacks to set or reset the value of the atom.
    // This can be called from the atom effect function directly to initialize the
    // initial value of the atom, or asynchronously called later to change it.
    setSelf: (
      | T
      | DefaultValue
      | Promise<T | DefaultValue> // Only allowed for initialization at this time
      | ((T | DefaultValue) => T | DefaultValue),
    ) => void,
    resetSelf: () => void,

    // Subscribe to changes in the atom value.
    // The callback is not called due to changes from this effect's own setSelf().
    onSet: (
      (newValue: T, oldValue: T | DefaultValue, isReset: boolean) => void,
    ) => void,

    // Callbacks to read other atoms/selectors
    getPromise: <S>(RecoilValue<S>) => Promise<S>,
    getLoadable: <S>(RecoilValue<S>) => Loadable<S>,
    getInfo_UNSTABLE: <S>(RecoilValue<S>) => RecoilValueInfo<S>,
  }) => void | () => void; // Optionally return a cleanup handler
  ```

**Atom Effects와 Atoms 연결**

- Atom Effects는 atom과 `effects` 옵션을 통해 연결되어 있음
- 각각의 atom은 atom이 초기화 될 때 우선 순위에 따라 호출되는 atom effect 함수의 배열을 참조 가능
- 초기화: atom은 `<RecoilRoot>` 내에서 처음 사용될 때 초기화되지만 사용되지 않고 클린업 되면 다시 초기화
- 반환값: side-effects 클린업을 관리하는 옵셔널 클린업 핸들러를 반환 가능
  ```js
  const myState = atom({
    key: 'MyKey',
    default: null,
    effects: [
      () => {
        ...effect 1...
        return () => ...cleanup effect 1...;
      },
      () => { ...effect 2... },
    ],
  });
  ```
  - Atom families: 매개변수화나 비매개변수화된 effects를 지원
  ```js
  const myStateFamily = atomFamily({
    key: 'MyKey',
    default: null,
    effects: param => [
      () => {
        ...effect 1 using param...
        return () => ...cleanup effect 1...;
      },
      () => { ...effect 2 using param... },
    ],
  });
  ```

### Compared to React Effects

- 대부분의 경우 React의 `useEffect()`로 대체 가능
- 차이점

  - atom은 React context의 외부에서 생성됨
  - 동적으로 생성된 atom의 경우 React 컴포넌트 내에서 Effects를 관리하기 어려울 수 있음
  - atom 값을 초기화하거나 SSR과 함께 사용 불가

- atom effects를 사용하면 effects와 atom 정의를 함께 배치

  ```js
  const myState = atom({ key: "Key", default: null });

  function MyStateEffect(): React.Node {
    const [value, setValue] = useRecoilState(myState);
    useEffect(() => {
      // Called when the atom value changes
      store.set(value);
      store.onChange(setValue);
      return () => {
        store.onChange(null);
      }; // Cleanup effect
    }, [value]);
    return null;
  }

  function MyApp(): React.Node {
    return (
      <div>
        <MyStateEffect />
        ...
      </div>
    );
  }
  ```

### Compared to Snapshots

- `Snapshot hooks` API도 atom 상태 변화를 감시 가능
- `<RecoilRoot>`의 `initializeState` prop은 초기 렌더링을 위한 값을 초기화 가능
- 그러나 모든 상태 변화를 모니터링하고 동적 atom(특히 atom family)를 관리하는 데 어울리지 않음
- Atom Effects를 사용하면 atom 정의와 함께 atom 별로 side-effects 정의가 가능하며 여러 정책들을 쉽게 작성 가능

## Logging Example

- Atom Effects를 사용해 특정 atom의 state 변화를 기록
  ```js
  const currentUserIDState = atom({
    key: "CurrentUserID",
    default: null,
    effects: [
      ({ onSet }) => {
        onSet((newID) => {
          console.debug("Current user ID:", newID);
        });
      },
    ],
  });
  ```

## History Example

- Logging Example에서 더 복잡하게 변화 히스토리를 유지 가능
- 특정 변화를 원상태로 되돌리는 콜백 핸들러를 사용해 state 변경 내역 queue를 유지하는 Effect를 제공

  ```ts
  const history: Array<{
    label: string;
    undo: () => void;
  }> = [];

  const historyEffect =
    (name) =>
    ({ setSelf, onSet }) => {
      onSet((newValue, oldValue) => {
        history.push({
          label: `${name}: ${JSON.serialize(oldValue)} -> ${JSON.serialize(
            newValue
          )}`,
          undo: () => {
            setSelf(oldValue);
          },
        });
      });
    };

  const userInfoState = atomFamily({
    key: "UserInfo",
    default: null,
    effects: (userID) => [historyEffect(`${userID} user info`)],
  });
  ```
