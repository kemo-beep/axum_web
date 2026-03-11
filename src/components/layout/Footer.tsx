import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Integrations', href: '/#integrations' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Changelog', href: '/changelog' },
    ],
    company: [
      { name: 'About Us', href: '/#about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.4 } },
  }

  return (
    <footer className="relative mt-auto border-t border-[var(--line)] bg-[var(--surface)] pt-24 pb-12 overflow-hidden backdrop-blur-3xl">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-50">
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 h-[500px] w-[1000px] rounded-[100%] bg-gradient-to-t from-[var(--lagoon)]/10 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="page-wrap relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 mb-16"
        >
          {/* Brand Column */}
          <motion.div variants={item} className="lg:col-span-2 xl:col-span-3">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-3 text-[var(--sea-ink)] no-underline group mb-6 inline-flex"
            >
              <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white font-bold text-lg shadow-lg shadow-[var(--lagoon)]/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                S
              </div>
              <span className="text-xl font-bold tracking-tight">
                Structura
              </span>
            </Link>
            <p className="text-base text-[var(--sea-ink-soft)] max-w-sm leading-relaxed mb-8">
              The next-generation platform for managing organizations, billing,
              and API keys with unprecedented speed and elegance.
            </p>

            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink-soft)] transition-all hover:border-[var(--lagoon)] hover:text-[var(--lagoon-deep)] hover:-translate-y-1 hover:shadow-lg shadow-[var(--lagoon)]/10"
                >
                  <Icon className="size-4.5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Nav Columns */}
          <motion.div variants={item}>
            <h4 className="font-bold text-[var(--sea-ink)] mb-6 tracking-tight">
              Product
            </h4>
            <ul className="space-y-4">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-[var(--sea-ink-soft)] transition-colors hover:text-[var(--lagoon-deep)] relative group inline-flex items-center gap-1"
                  >
                    {link.name}
                    {link.name === 'Changelog' && (
                      <ArrowUpRight className="size-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h4 className="font-bold text-[var(--sea-ink)] mb-6 tracking-tight">
              Company
            </h4>
            <ul className="space-y-4">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-[var(--sea-ink-soft)] transition-colors hover:text-[var(--lagoon-deep)] relative group inline-flex items-center gap-1"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--lagoon)] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h4 className="font-bold text-[var(--sea-ink)] mb-6 tracking-tight">
              Legal
            </h4>
            <ul className="space-y-4">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-[var(--sea-ink-soft)] transition-colors hover:text-[var(--lagoon-deep)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-8 border-t border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--palm)] opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-[var(--palm)]"></span>
            </span>
            <span className="text-sm font-medium text-[var(--sea-ink-soft)]">
              All systems operational
            </span>
          </div>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            &copy; {year} SaaS App Inc. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
