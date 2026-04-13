import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import GirisNative from '../pages/GirisNative';
import AuthNative from '../pages/AuthNative';
import MarketPlaceNative from '../pages/MarketPlaceNative';
import MagzaNative from '../pages/MagzaNative';

function renderWithRouter(ui, route = '/') {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

beforeEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('native Fresha pages (replica parity baseline)', () => {
  test('giris-native renders root shell', () => {
    const { container } = renderWithRouter(<GirisNative />, '/giris-native');
    expect(container.querySelector('.gra-shell')).toBeTruthy();
  });

  test('auth-native renders root shell', () => {
    const { container } = renderWithRouter(<AuthNative />, '/auth-native');
    expect(container.querySelector('.ara-shell')).toBeTruthy();
  });

  test('marketplace-native renders root shell', () => {
    const { container } = renderWithRouter(<MarketPlaceNative />, '/marketplace-native');
    expect(container.querySelector('.mpr-shell')).toBeTruthy();
  });

  test('magza-native renders root shell', () => {
    const { container } = renderWithRouter(<MagzaNative />, '/magza-native');
    expect(container.querySelector('.mzr-shell')).toBeTruthy();
  });
});
