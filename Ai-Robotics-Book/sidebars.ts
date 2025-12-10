import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual sidebar for AI Robotics Book
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['intro', 'overview'],
    },
    {
      type: 'category',
      label: 'AI Fundamentals',
      items: [
        'ai-fundamentals/machine-learning',
        'ai-fundamentals/deep-learning',
        'ai-fundamentals/neural-networks',
        'ai-fundamentals/natural-language-processing',
        'ai-fundamentals/computer-vision',
        'ai-fundamentals/reinforcement-learning',
      ],
    },
    {
      type: 'category',
      label: 'Robotics Concepts',
      items: [
        'robotics-concepts/robot-kinematics',
        'robotics-concepts/robot-dynamics',
        'robotics-concepts/path-planning',
        'robotics-concepts/control-systems',
        'robotics-concepts/sensors-perception',
        'robotics-concepts/robot-hardware-actuators',
        'robotics-concepts/human-robot-interaction',
      ],
    },
    {
      type: 'category',
      label: 'AI-Robotics Integration',
      items: [
        'ai-robotics-integration/perception',
        'ai-robotics-integration/motion-planning',
        'ai-robotics-integration/learning-from-demonstration',
        'ai-robotics-integration/adaptive-control-systems',
      ],
    },
    {
      type: 'category',
      label: 'Applications',
      items: [
        'applications/industrial-automation',
        'applications/service-robotics',
        'applications/autonomous-vehicles',
        'applications/medical-robotics',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/ros',
        'development/simulation-environments',
        'development/ros-advanced-topics',
      ],
    },
    {
      type: 'category',
      label: 'Ethics & Future',
      items: [
        'ethics/robot-ethics',
        'ethics/ai-safety-control',
        'ethics/future-ai-robotics',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorial-basics/create-a-document',
        'tutorial-basics/create-a-blog-post',
        'tutorial-basics/markdown-features',
        'tutorial-basics/congratulations',
      ],
    },
  ],
};

export default sidebars;
