'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Share2 } from 'lucide-react'
import { SumbawaPattern } from '../ui/SumbawaPattern'
import { SumbawaBorder } from '../ui/SumbawaBorder'
import { FloralDivider } from '../ui/FloralDivider'
import { type BankAccount } from '@/lib/weddingData'

// Requirements: 8.10

interface ClosingSectionProps {
  groomName: string
  brideName: string
  groomFullName: string
  brideFullName: string
  bankAccounts?: BankAccount[]
  isVisible?: boolean
}

interface BankCardProps {
  account: BankAccount
}

function BankCard({ account }: BankCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea')
      el.value = account.accountNumber
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-sumbawa-ivory/10 border border-sumbawa-gold/30 p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sumbawa-gold font-poppins font-semibold text-sm">{account.bank}</p>
        <p className="text-sumbawa-ivory font-poppins font-light text-base tracking-widest mt-1">
          {account.accountNumber}
        </p>
        <p className="text-sumbawa-ivory/60 font-poppins font-light text-xs mt-1">
          a.n. {account.accountName}
        </p>
      </div>
      <button
        onClick={handleCopy}
        aria-label={`Salin nomor rekening ${account.bank}: ${account.accountNumber}`}
        className="
          min-w-[44px] min-h-[44px] flex items-center justify-center
          border border-sumbawa-gold/50 text-sumbawa-gold
          hover:bg-sumbawa-gold hover:text-sumbawa-maroon
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-sumbawa-gold
          flex-shrink-0
        "
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

export function ClosingSection({
  groomName,
  brideName,
  groomFullName,
  brideFullName,
  bankAccounts,
  isVisible = false,
}: ClosingSectionProps) {
  const [shareSuccess, setShareSuccess] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: `Undangan Pernikahan ${groomName} & ${brideName}`,
      text: `Kami mengundang Anda untuk hadir di pernikahan ${groomFullName} & ${brideFullName}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    } catch {
      // User cancelled or error — silently ignore
    }
  }

  return (
    <section className="relative py-20 px-6 bg-sumbawa-maroon overflow-hidden">
      <SumbawaPattern opacity={0.06} />
      <SumbawaBorder position="top" className="absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Closing message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-sumbawa-gold font-poppins font-light text-xs tracking-[0.3em] uppercase mb-6">
            Penutup
          </p>

          <p className="text-sumbawa-ivory/90 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
            dan memberikan doa restu kepada kami.
          </p>

          <FloralDivider className="my-8" />

          {/* Couple names */}
          <p className="text-sumbawa-ivory/60 font-poppins font-light text-sm mb-2">
            Dengan penuh cinta,
          </p>
          <h2 className="text-sumbawa-gold font-poppins font-light tracking-widest text-2xl sm:text-3xl">
            {groomName} &amp; {brideName}
          </h2>
          <p className="text-sumbawa-ivory/50 font-poppins font-light text-xs mt-2">
            beserta keluarga besar
          </p>
        </motion.div>

        {/* Wedding gift section */}
        {bankAccounts && bankAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-10"
          >
            <div className="border border-sumbawa-gold/30 p-6">
              <p className="text-sumbawa-gold font-poppins font-medium text-sm tracking-widest uppercase mb-2">
                Wedding Gift
              </p>
              <p className="text-sumbawa-ivory/70 font-poppins font-light text-xs mb-6">
                Bagi yang ingin memberikan hadiah pernikahan, dapat melalui rekening berikut:
              </p>
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <BankCard key={`${account.bank}-${account.accountNumber}`} account={account} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Share button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-12"
        >
          <button
            onClick={handleShare}
            aria-label="Bagikan undangan pernikahan"
            className="
              inline-flex items-center gap-2
              min-h-[48px] px-6 py-3
              border border-sumbawa-gold text-sumbawa-gold
              font-poppins font-medium text-sm tracking-widest uppercase
              hover:bg-sumbawa-gold hover:text-sumbawa-maroon
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-sumbawa-gold
            "
          >
            <Share2 className="w-4 h-4" />
            {shareSuccess ? 'Link Tersalin!' : 'Bagikan Undangan'}
          </button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <FloralDivider className="mb-6" />
          <p className="text-sumbawa-ivory/40 font-poppins font-light text-xs tracking-widest">
            {groomFullName} &amp; {brideFullName} · {new Date().getFullYear()}
          </p>
          <p className="text-sumbawa-gold/30 font-poppins font-light text-xs mt-2">
            Made with ❤️ in Sumbawa
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
