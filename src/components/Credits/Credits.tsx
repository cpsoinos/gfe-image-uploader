import './Credits.styles.css'
import type { FC } from 'react'

export const Credits: FC = () => (
  <div className="credits" data-gfe-screenshot-exclude="true">
    A challenge by{' '}
    <a
      href="https://www.greatfrontend.com/projects?ref=challenges"
      target="_blank"
      rel="noreferrer"
    >
      GreatFrontEnd Projects
    </a>
    . Built by{' '}
    <a href="https://www.greatfrontend.com/projects/u/cpsoinos" target="_blank" rel="noreferrer">
      Corey Psoinos
    </a>
    .
  </div>
)
