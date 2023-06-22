# Installation

## NPM

```
npm install recoil
```

```
yarn add recoil
```

### Bundler

- `Webpack`이나 `Rollup`과 같은 모듈 번들러와 호환

### ES5 지원 X

- Recoil 빌드는 ES5로 트랜스파일 되지 않음
- 레거시 브라우저를 지원해야 하는 경우, Babel로 컴파일하고 preset `@babel/preset-env`을 이용하여 수행할 수 있지만 문제가 발생할 수 있음
- ES6의 요소들을 폴리필을 사용해 에뮬레이션 하면 성능이 저하될 수 있음

## ESLint

- `eslint-plugin-react-hook`을 사용하는 경우, `additionalHooks`를 추가

```js
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        "additionalHooks": "useRecoilCallback"
      }
    ]
  }
}
```
