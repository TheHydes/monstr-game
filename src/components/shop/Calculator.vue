<template>
  <div class="relative w-full max-w-sm mx-auto rounded-2xl shadow-lg bg-slate-900 h-[650px]">
    <img
      :src="calculatorBg"
      alt="Calculator background"
      class="absolute w-full object-contain pointer-events-none select-none pt-16"
    />

    <div class="relative w-full flex flex-col px-8">
      <div class="flex justify-between items-center h-16 mb-8">
        <button class="btn-remove px-3 py-1 text-xs" @click="onDel">DEL</button>
        <button class="btn-remove px-3 py-1 text-xs" @click="onClear">CLEAR</button>
      </div>

      <input
        v-model="expression"
        @keydown="onKey"
        @paste="onPaste"
        class="w-full rounded bg-slate-950/75 text-right text-2xl font-mono px-3 py-2 mb-6 outline-none text-white"
      />

      <div class="grid grid-cols-4 gap-2 mb-7">
        <button class="h-14" @click="append('7')" />
        <button class="h-14" @click="append('8')" />
        <button class="h-14" @click="append('9')" />
        <button class="h-14" @click="append('/')" />

        <button class="h-14" @click="append('4')" />
        <button class="h-14" @click="append('5')" />
        <button class="h-14" @click="append('6')" />
        <button class="h-14" @click="append('*')" />

        <button class="h-14" @click="append('1')" />
        <button class="h-14" @click="append('2')" />
        <button class="h-14" @click="append('3')" />
        <button class="h-14" @click="append('-')" />

        <button class="h-14" @click="append('0')" />
        <button class="h-14" @click="append('.')" />
        <button class="h-14" @click="evaluate" />
        <button class="h-14" @click="append('+')" />
      </div>

      <div class="text-xs mt-3 leading-5">
        <p>Keys:</p>
        <p>• Numbers: 0-9</p>
        <p>• Addition: +</p>
        <p>• Subtraction: -</p>
        <p>• Multiplication: x X *</p>
        <p>• Division: /</p>
        <p>• Enter: equals</p>
        <p>• DELETE: Backspace</p>
        <p>• Clear: c C</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import calculatorBg from '@/assets/Images/Misc/calculator.jpg'

const expression = ref('')
const justEvaluated = ref(false)

function onClear() {
  expression.value = ''
  justEvaluated.value = false
}

function onDel() {
  if (expression.value.length > 0) {
    expression.value = expression.value.slice(0, -1)
  }
}

const OPS = ['+', '-', '*', '/']
const isOp = (ch) => OPS.includes(ch)

function onKey(e) {
  const key = e.key

  // Ctrl+C, Ctrl+V, Ctrl+A, ...
  if (e.ctrlKey || e.metaKey) {
    return
  }

  if (key === 'Enter') {
    e.preventDefault()
    evaluate()
    return
  }

  if (key === 'Backspace') {
    e.preventDefault()
    onDel()
    return
  }

  if (key.toLowerCase() === 'c') {
    e.preventDefault()
    onClear()
    return
  }

  if (/^[0-9]$/.test(key) || key === '.' || '+-*/xX÷×'.includes(key)) {
    e.preventDefault()

    // x, X, × -> *, ÷ -> /
    let v = key

    if (key.toLowerCase() === 'x' || key === '×') {
      v = '*'
    }
    if (key === '÷') {
      v = '/'
    }

    append(v)
    return
  }

  e.preventDefault()
}

function onPaste(e) {
  const text = e.clipboardData?.getData('text') ?? ''
  if (!text) return

  e.preventDefault()

  let cleaned = text.replace(/\s+/g, '').replace(/,/g, '.')

  // ÷ -> /, ×  ·  x  X -> *, − -> -
  cleaned = cleaned
    .replace(/÷/g, '/')
    .replace(/[×·xX]/g, '*')
    .replace(/−/g, '-')

  cleaned = cleaned.replace(/[^0-9+\-*/.]/g, '')

  for (const ch of cleaned) {
    append(ch)
  }
}

function append(v) {
  const current = expression.value
  const isDigit = /^[0-9]$/.test(v)
  const isOperator = isOp(v)

  if (justEvaluated.value && /[\d.]/.test(v)) {
    expression.value = ''
  }
  justEvaluated.value = false

  if (current === '') {
    if (isDigit) {
      expression.value = v
      return
    }
    if (isOperator) {
      if (v === '-') {
        expression.value = '-'
      }
      return
    }
    if (v === '.') {
      expression.value = '0.'
      return
    }
    return
  }

  const last = current[current.length - 1]
  const lastIsOp = isOp(last)
  const lastIsDot = last === '.'

  if (isDigit) {
    expression.value += v
    return
  }

  if (v === '.') {
    if (lastIsDot) return

    if (lastIsOp) {
      expression.value += '0.'
      return
    }

    const lastPlus = current.lastIndexOf('+')
    const lastMinus = current.lastIndexOf('-')
    const lastMul = current.lastIndexOf('*')
    const lastDiv = current.lastIndexOf('/')

    const lastOpIndex = Math.max(lastPlus, lastMinus, lastMul, lastDiv)
    const currentNumber = current.slice(lastOpIndex + 1)

    if (currentNumber.includes('.')) {
      return
    }

    expression.value += v
    return
  }

  if (isOperator) {
    if (lastIsDot) {
      return
    }

    if (lastIsOp) {
      expression.value = current.slice(0, -1) + v
      return
    }

    expression.value += v
  }
}

function sanitizeExpression(raw) {
  let exp = raw.trim()

  exp = exp
    .replace(/÷/g, '/')
    .replace(/[×·xX]/g, '*')
    .replace(/−/g, '-')

  while (exp.length && /[+\-*/]$/.test(exp)) {
    exp = exp.slice(0, -1)
  }

  return exp
}

function tokenize(exp) {
  const tokens = []
  let number = ''

  for (let ch of exp) {
    if (ch === ' ') continue

    if (/[0-9.]/.test(ch)) {
      number += ch
      continue
    }

    if (ch === '-' && number === '' && tokens.length === 0) {
      number = '-'
      continue
    }

    if (isOp(ch)) {
      if (number !== '') {
        tokens.push(parseFloat(number))
        number = ''
      }
      tokens.push(ch)
    }
  }

  if (number !== '') tokens.push(parseFloat(number))

  return tokens
}

function evaluateTokens(tokens) {
  if (tokens.length === 0) return 0

  let result = []
  let i = 0

  while (i < tokens.length) {
    const tok = tokens[i]

    if (tok === '*' || tok === '/') {
      const prev = result.pop()
      const next = tokens[i + 1]
      const value = tok === '*' ? prev * next : prev / next
      result.push(value)
      i += 2
    } else {
      result.push(tok)
      i++
    }
  }

  let acc = result[0]
  i = 1

  while (i < result.length) {
    const op = result[i]
    const val = result[i + 1]
    if (op === '+') acc += val
    else if (op === '-') acc -= val
    i += 2
  }

  return acc
}

function formatResult(num) {
  if (!isFinite(num)) return 'Error'

  const fixed = Number(num.toFixed(6))

  return fixed.toString()
}

function evaluate() {
  try {
    const clean = sanitizeExpression(expression.value)

    if (!clean) {
      expression.value = ''
      justEvaluated.value = false
      return
    }

    const tokens = tokenize(clean)
    const raw = evaluateTokens(tokens)
    const formatted = formatResult(raw)

    expression.value = formatted
    justEvaluated.value = true
  } catch {
    expression.value = 'Error'
    justEvaluated.value = false
  }
}
</script>
