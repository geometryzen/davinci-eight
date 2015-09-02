interface ReferenceCounted {
  addRef(): void;
  release(): void;
}

export = ReferenceCounted;