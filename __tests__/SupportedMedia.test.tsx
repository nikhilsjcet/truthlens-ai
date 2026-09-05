import React from 'react';
import { render, screen } from '@testing-library/react';
import SupportedMedia from '../components/SupportedMedia';

describe('SupportedMedia Component', () => {
  it('renders the heading correctly', () => {
    render(<SupportedMedia />);
    expect(screen.getByText(/Comprehensive Modality Support/i)).toBeInTheDocument();
  });

  it('displays image, audio, and video support badges', () => {
    render(<SupportedMedia />);
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
  });
});
