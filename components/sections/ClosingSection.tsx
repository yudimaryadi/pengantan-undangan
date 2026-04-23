'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Share2 } from 'lucide-react'
import { FloralDivider } from '../ui/FloralDivider'
import { FloralCorner } from '../ui/FloralCorner'
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
      document.execCommand('copy') // eslint-disable-line
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border border-w-border shadow-soft">
      <div>
        <p className="text-w-rose font-poppins font-medium text-xs tracking-[0.15em] uppercase mb-1">{account.bank}</p>
        <p className="text-w-ink font-poppins font-light text-base tracking-widest">{account.accountNumber}</p>
        <p className="text-w-subtle font-poppins font-light text-xs mt-1">a.n. {account.accountName}</p>
      </div>
      <button onClick={handleCopy} aria-label={`Salin nomor rekening ${account.bank}`}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center border border-w-border text-w-muted hover:border-w-rose hover:text-w-rose transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-w-rose flex-shrink-0">
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

export function ClosingSection({
  groomName, brideName, groomFullName, brideFullName, bankAccounts, isVisible = false,
}: ClosingSectionProps) {
  const [shareSuccess, setShareSuccess] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Undangan Pernikahan ${groomName} & ${brideName}`,
          text: `Kami mengundang Anda untuk hadir di pernikahan ${groomFullName} & ${brideFullName}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    } catch { /* cancelled */ }
  }

  return (
    <section className="relative py-24 px-6 bg-w-bg overflow-hidden">
      <FloralCorner position="top-left" size="md" />
      <FloralCorner position="top-right" size="md" />
      <FloralCorner position="bottom-left" size="lg" />
      <FloralCorner position="bottom-right" size="lg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-w-rose-pale/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.5em] uppercase mb-8">Penutup</p>

          <p className="text-w-body font-poppins font-light text-sm sm:text-base leading-relaxed mb-10">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
            dan memberikan doa restu kepada kami.
          </p>

          <FloralDivider variant="rose" className="my-8" />

          <p className="text-w-subtle font-poppins font-light text-xs tracking-[0.2em] uppercase mb-3">
            Dengan penuh cinta,
          </p>
          <h2 className="font-cormorant font-light text-w-ink text-3xl sm:text-4xl tracking-wide mb-2">
            {groomName} &amp; {brideName}
          </h2>
          <p className="text-w-subtle font-poppins font-light text-xs">beserta keluarga besar</p>
        </motion.div>

        {bankAccounts && bankAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-10 text-left"
          >
            <div className="border border-w-border p-6 bg-w-bgAlt shadow-soft">
              <p className="text-w-rose font-poppins font-light text-[10px] tracking-[0.3em] uppercase mb-1 text-center">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-16"
        >
          <button onClick={handleShare} aria-label="Bagikan undangan pernikahan"
            className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 border border-w-border text-w-muted bg-white font-poppins font-light text-xs tracking-[0.2em] uppercase shadow-soft hover:border-w-rose hover:text-w-rose transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-w-rose">
            <Share2 className="w-3.5 h-3.5" />
            {shareSuccess ? 'Link Tersalin!' : 'Bagikan Undangan'}
          </button>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <FloralDivider variant="minimal" className="mb-6" />
          <p className="text-w-subtle font-poppins font-light text-xs tracking-widest">
            {groomFullName} &amp; {brideFullName} · {new Date().getFullYear()}
          </p>
          <p className="text-w-subtle/60 font-poppins font-light text-[10px] mt-2">
            Made with ❤️ By Iduyy
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
