'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { type BankAccount } from '@/lib/weddingData'

interface ClosingSectionProps {
  groomName: string
  brideName: string
  groomFullName: string
  brideFullName: string
  bankAccounts?: BankAccount[]
  isVisible?: boolean
}

function BankCard({ account }: { account: BankAccount }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
    } catch {
      const el = document.createElement('textarea')
      el.value = account.accountNumber
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-w-dark border border-w-border">
      <div>
        <p className="text-w-gold font-poppins font-medium text-xs tracking-[0.15em] uppercase mb-1">{account.bank}</p>
        <p className="text-w-champagne font-poppins font-light text-base tracking-widest">{account.accountNumber}</p>
        <p className="text-w-subtle font-poppins font-light text-xs mt-1">a.n. {account.accountName}</p>
      </div>
      <button
        onClick={handleCopy}
        aria-label={`Salin nomor rekening ${account.bank}`}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center border border-w-border text-w-subtle hover:border-w-gold hover:text-w-gold transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-w-gold flex-shrink-0"
      >
        {copied ? <Check className="w-4 h-4 text-w-sage" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

export function ClosingSection({
  groomName, brideName, groomFullName, brideFullName, bankAccounts, isVisible = false,
}: ClosingSectionProps) {

  return (
    <section className="relative py-24 px-6 bg-w-dark overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-w-gold/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto text-center">

        {/* Closing message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-w-gold/50 font-poppins font-light text-[10px] tracking-[0.4em] uppercase mb-8">
            Penutup
          </p>

          <p className="text-w-muted font-poppins font-light text-sm sm:text-base leading-relaxed mb-10">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
            dan memberikan doa restu kepada kami.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-w-gold/30" />
            <span className="text-w-gold/40 text-xs">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-w-gold/30" />
          </div>

          <p className="text-w-subtle font-poppins font-light text-xs tracking-[0.2em] uppercase mb-3">
            Dengan penuh cinta,
          </p>
          <h2 className="font-cormorant font-light text-w-champagne text-3xl sm:text-4xl tracking-wide mb-2">
            {groomName} &amp; {brideName}
          </h2>
          <p className="text-w-subtle font-poppins font-light text-xs">beserta keluarga besar</p>
        </motion.div>

        {/* Wedding gift */}
        {bankAccounts && bankAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-10 text-left"
          >
            <div className="border border-w-border p-6">
              <p className="text-w-gold font-poppins font-light text-[10px] tracking-[0.3em] uppercase mb-1 text-center">
                Wedding Gift
              </p>
              <p className="text-w-subtle font-poppins font-light text-xs mb-5 text-center">
                Bagi yang ingin memberikan hadiah pernikahan
              </p>
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <BankCard key={`${account.bank}-${account.accountNumber}`} account={account} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="h-px w-16 bg-w-border mx-auto mb-6" />
          <p className="text-w-subtle font-poppins font-light text-xs tracking-widest">
            {groomFullName} &amp; {brideFullName} · {new Date().getFullYear()}
          </p>
          <p className="text-w-subtle/50 font-poppins font-light text-[10px] mt-2">
            Made with ❤️ By Iduyy
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
