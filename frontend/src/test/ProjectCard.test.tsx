import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from '@/components/ProjectCard';
import type { ProjectSummary } from '@/types';
import { renderWithProviders } from './utils';

const project: ProjectSummary = {
  id: '1',
  slug: 'badhra',
  title: 'Badhra — AI for Agriculture',
  tagline: 'Exploring how existing farmer and soil information could support decisions.',
  summary: 'Early-stage project.',
  status: 'RESEARCH',
  technologies: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  featured: true,
  displayOrder: 4,
};

describe('ProjectCard', () => {
  it('links to the case study and shows an honest status label', () => {
    renderWithProviders(<ProjectCard project={project} index={3} />);

    expect(screen.getByRole('link', { name: project.title })).toHaveAttribute('href', '/projects/badhra');
    expect(screen.getByText('In progress · Research & validation')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('collapses long technology lists', () => {
    renderWithProviders(<ProjectCard project={project} index={0} />);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows no badge when the status is unknown', () => {
    renderWithProviders(<ProjectCard project={{ ...project, status: undefined }} index={0} />);
    expect(screen.queryByText(/Research/)).not.toBeInTheDocument();
  });
});
