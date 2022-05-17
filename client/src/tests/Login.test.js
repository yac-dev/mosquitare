import { render as reactTestingLibraryRender, screen, getByText } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import Login from '../components/Signup/Login';
import '@testing-library/jest-dom/extend-expect';

const render = (component) => {
  reactTestingLibraryRender(<Provider store={store}>{component}</Provider>);
};

// const modalContainer = document.querySelector('.modal');
// const elem = getByText(modalContainer, 'test');

test('on initial render', () => {
  const component = render(<Login />);
});
