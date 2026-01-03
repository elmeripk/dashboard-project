type Success<T> = {
    data: T;
    error: null;
}

type Failure<E> = {
    data: null;
    error: E
}
// Example from: https://www.youtube.com/watch?v=Y6jT-IkV0VM&t=638s
export type Result<T> = Success<T> | Failure<string>
  