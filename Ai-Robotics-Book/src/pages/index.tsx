import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={clsx("hero__title", styles.fadeInUp)}>
              <Heading as="h1">
                {siteConfig.title}
              </Heading>
            </div>
            <p className={clsx("hero__subtitle", styles.fadeInUp)} style={{animationDelay: '0.2s'}}>
              {siteConfig.tagline}
            </p>
            <div className={clsx(styles.buttons, styles.fadeInUp)} style={{animationDelay: '0.4s'}}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Get Started
              </Link>
              <Link
                className="button button--outline button--lg"
                to="/docs/chatbot">
                Try AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  const stats = [
    { number: "50+", label: "AI Concepts Explained" },
    { number: "20+", label: "Robotics Projects" },
    { number: "100+", label: "Pages of Content" },
    { number: "10", label: "Real-World Applications" }
  ];

  return (
    <section className={styles.statsSection}>
      <div className={styles.statsContainer}>
        <Heading as="h2" className="text--center">
          Comprehensive Learning Journey
        </Heading>
        <p className="text--center" style={{maxWidth: '600px', margin: '1rem auto', color: '#64748b'}}>
          Explore the cutting-edge intersection of artificial intelligence and robotics with our comprehensive guide
        </p>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statNumber}>{stat.number}</div>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      text: "This comprehensive guide has transformed my understanding of AI-powered robotics. The practical examples and clear explanations make complex concepts accessible.",
      author: "Sarah Johnson, Robotics Engineer"
    },
    {
      text: "An exceptional resource that bridges the gap between theoretical AI concepts and practical robotics implementation. Highly recommended for anyone in the field.",
      author: "Michael Chen, AI Researcher"
    },
    {
      text: "The integration of AI and robotics concepts is brilliantly explained. This book has become my go-to reference for humanoid robot development.",
      author: "Dr. Emily Rodriguez, PhD in Robotics"
    }
  ];

  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <Heading as="h2" className="text--center">
          What Readers Say
        </Heading>
        <p className="text--center" style={{maxWidth: '600px', margin: '1rem auto', color: '#64748b'}}>
          Join thousands of professionals who have enhanced their knowledge with our comprehensive guide
        </p>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
              <p className={styles.testimonialAuthor}>{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" className={styles.ctaTitle}>
              Start Your AI Robotics Journey Today
            </Heading>
            <p className={styles.ctaSubtitle}>
              Dive deep into the world of AI-powered humanoid robots and transform your understanding of modern robotics.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Begin Learning
              </Link>
              <Link
                className="button button--outline button--lg"
                to="/docs/chatbot">
                Try AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Comprehensive guide to Physical AI and Humanoid Robots">
      <HomepageHeader />
      <main>
        <StatsSection />
        <HomepageFeatures />
        <TestimonialsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
