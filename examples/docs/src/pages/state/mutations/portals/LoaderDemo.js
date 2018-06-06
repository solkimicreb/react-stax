import React from 'react';

export default function render({ view, store }) {
  const loader = store({
    isLoading: false
  });

  const startLoading = () => (loader.isLoading = true);
  const stopLoading = () => (loader.isLoading = false);
  const Loader = view(
    () => (loader.isLoading ? <span>DUMMY LOADER</span> : null)
  );

  return () => (
    <div>
      <button onClick={startLoading}>Start loading</button>
      <button onClick={stopLoading}>Stop loading</button>
      <Loader />
    </div>
  );
}
