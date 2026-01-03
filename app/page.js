'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============ TECH ICONS (SVG) ============
const TechIcons = {
  dotnet: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#5C2D91" d="M61.195 0h4.953c12.918.535 25.688 4.89 36.043 12.676 9.809 7.289 17.473 17.437 21.727 28.906 2.441 6.387 3.664 13.18 4.082 19.992v4.211c-.414 11.293-3.664 22.465-9.539 32.058-7.207 11.938-18.191 21.465-30.996 26.418-9.34 3.664-19.449 5.156-29.398 4.551-12.597-.836-24.926-5.27-35.156-12.539-9.387-6.664-17.031-15.808-21.836-26.297C-1.387 83.09-1.566 75.34.98 68.086c2.793-8.055 9.012-14.453 16.539-18.066 4.402-2.176 9.281-3.32 14.152-3.703 7.125-.457 14.293.941 20.703 4.168-1.469-.093-2.938-.176-4.402-.348-6.555-.93-12.926-3.418-18.023-7.543-4.91-3.969-8.503-9.48-10.078-15.586-.941-3.82-1.078-7.84-.453-11.73.996-6.074 4.047-11.715 8.523-15.91C32.348 4.242 38.109 1.32 44.168.355c5.566-.933 11.328-.36 16.719.996l.308-.235C61.191.64 61.191.32 61.195 0"/>
      <path fill="#fff" d="M61.195 0c0 .32 0 .64-.004.96l-.308.235c-5.391-1.356-11.153-1.93-16.719-.996-6.059.965-11.82 3.887-16.227 8.348-4.476 4.195-7.527 9.836-8.523 15.91-.625 3.89-.488 7.91.453 11.73 1.574 6.106 5.168 11.617 10.078 15.586 5.097 4.125 11.468 6.613 18.023 7.543 1.465.172 2.934.254 4.402.348-6.41-3.227-13.578-4.625-20.703-4.168-4.871.383-9.75 1.527-14.152 3.703-7.527 3.613-13.746 10.011-16.539 18.066-2.546 7.254-2.367 15.004.094 21.89 4.805 10.489 12.449 19.633 21.836 26.297 10.23 7.27 22.559 11.703 35.156 12.539 9.95.605 20.059-.887 29.398-4.55 12.805-4.954 23.79-14.481 30.996-26.419 5.875-9.593 9.125-20.765 9.54-32.058v-4.21c-.419-6.813-1.642-13.606-4.083-19.993-4.254-11.469-11.918-21.617-21.727-28.906C73.883 4.89 61.113.535 48.195 0h12.996"/>
      <path fill="#5C2D91" d="M39.734 23.578c2.27-1.523 5.083-1.977 7.758-1.782 2.48.235 4.914 1.18 6.801 2.79 2.145 1.804 3.601 4.348 4.117 7.078.453 2.465.254 5.07-.57 7.426-1.02 2.87-3.098 5.343-5.75 6.871-2.438 1.446-5.32 2.067-8.133 1.86-2.637-.2-5.21-1.168-7.254-2.84-2.137-1.726-3.633-4.168-4.218-6.82-.554-2.488-.37-5.133.512-7.508.996-2.754 3.015-5.12 5.601-6.602.368-.23.754-.426 1.136-.473"/>
    </svg>
  ),
  azure: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#0089D6" d="M46.024 109.27h66.742L68.97 82.093l44.363-73.27H77.477L46.024 52.86z"/>
      <path fill="#0089D6" d="M77.477 8.824H46.024L0 109.27h30.854z"/>
    </svg>
  ),
  kubernetes: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#326CE5" d="M64 0C28.654 0 0 28.654 0 64s28.654 64 64 64 64-28.654 64-64S99.346 0 64 0"/>
      <path fill="#fff" d="M64 16c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48m0 8c22.091 0 40 17.909 40 40s-17.909 40-40 40-40-17.909-40-40 17.909-40 40-40"/>
      <path fill="#fff" d="M64 32l-24 14v28l24 14 24-14V46z"/>
    </svg>
  ),
  snowflake: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#29B5E8" d="M64 8L40 24v24L64 64l24-16V24zm0 48L40 72v24l24 16 24-16V72zM24 40L0 56v16l24 16 24-16V56zM104 40l-24 16v16l24 16 24-16V56z"/>
    </svg>
  ),
  svelte: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#FF3E00" d="M110.43 16.936C98.553-.076 75.09-5.118 58.13 6.696L29.585 25.29c-7.953 5.543-13.204 13.648-14.698 22.723-1.232 7.508.055 15.18 3.598 21.86a32.8 32.8 0 0 0-4.87 12.268c-1.53 9.56.715 19.395 6.21 27.16 11.878 17.012 35.34 22.055 52.3 10.241l28.545-18.594c7.952-5.543 13.204-13.649 14.697-22.724 1.233-7.507-.055-15.179-3.598-21.859a32.8 32.8 0 0 0 4.871-12.268c1.53-9.559-.715-19.394-6.21-27.16z"/>
      <path fill="#fff" d="M55.219 112.662a28.4 28.4 0 0 1-12.59-14.163 26.3 26.3 0 0 1-1.687-13.592l.577-3.554 3.185 2.278a37.8 37.8 0 0 0 11.43 5.753l1.087.312-.1 1.088a7.87 7.87 0 0 0 1.456 5.416 8.5 8.5 0 0 0 7.202 3.638 9.3 9.3 0 0 0 2.83-.456l28.47-18.54a7.3 7.3 0 0 0 3.2-4.868 7.9 7.9 0 0 0-1.15-5.89 8.5 8.5 0 0 0-7.202-3.637 9.3 9.3 0 0 0-2.83.456l-10.867 7.073a29.3 29.3 0 0 1-9.444 3.988 28.4 28.4 0 0 1-24.028-4.153 26.3 26.3 0 0 1-10.681-17.873 25.2 25.2 0 0 1 3.83-16.268l28.47-18.54a29.3 29.3 0 0 1 9.443-3.988 28.4 28.4 0 0 1 12.591 14.163 26.3 26.3 0 0 1 1.687 13.593l-.577 3.553-3.185-2.277a37.8 37.8 0 0 0-11.43-5.753l-1.087-.313.1-1.087a7.87 7.87 0 0 0-1.456-5.417 8.5 8.5 0 0 0-7.202-3.637 9.3 9.3 0 0 0-2.83.456l-28.47 18.54a7.3 7.3 0 0 0-3.2 4.867 7.9 7.9 0 0 0 1.15 5.891 8.5 8.5 0 0 0 7.202 3.637 9.3 9.3 0 0 0 2.83-.456l10.867-7.074a29.3 29.3 0 0 1 9.444-3.987 28.4 28.4 0 0 1 24.028 4.152 26.3 26.3 0 0 1 10.68 17.873 25.2 25.2 0 0 1-3.829 16.268l-28.47 18.54a29.3 29.3 0 0 1-9.443 3.988 29 29 0 0 1-9.001.397z"/>
    </svg>
  ),
  python: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#FFD845" d="M64 8c-33.137 0-60 26.863-60 60s26.863 60 60 60 60-26.863 60-60S97.137 8 64 8"/>
      <path fill="#3776AB" d="M64 8c-16.568 0-30 13.432-30 30v30c0 16.568 13.432 30 30 30h30V68c0-16.568-13.432-30-30-30zm-10 20a10 10 0 1 1 0 20 10 10 0 0 1 0-20"/>
      <path fill="#FFD845" d="M64 120c16.568 0 30-13.432 30-30V60c0-16.568-13.432-30-30-30H34v30c0 16.568 13.432 30 30 30zm10-20a10 10 0 1 1 0-20 10 10 0 0 1 0 20"/>
    </svg>
  ),
  openai: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="currentColor" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#2396ED" d="M124.8 52.1c-4.3-2.5-10-2.8-14.8-1.4-.6-5.2-4-9.7-8-12.9l-1.6-1.3-1.4 1.6c-2.7 3.1-3.5 8.3-3.1 12.3.3 2.9 1.2 5.9 3 8.3-1.4.8-2.9 1.9-4.3 2.4-2.8 1-5.9 2-8.9 2H79V49H66V24H41v12H28V24H15v25H2v13H.1c-.1 1.5-.2 3-.1 4.5.5 7.3 3.1 14.2 7.8 19.7 5.3 6.1 13.1 9.8 21.7 11 3.7.5 7.4.6 11.1.3 5.6-.4 11.1-1.7 16.2-3.8 4.2-1.8 8-4.1 11.4-7 5.5-4.7 10.2-10.8 13.2-17.5h1.1c4.6 0 9.4-.2 13.6-2.3 2.2-1.1 4.2-2.7 5.6-4.7l.7-1 .1-.2-1.2-.8z"/>
      <path fill="#2396ED" d="M28 39h10v11H28zm13 0h11v11H41zm0-13h11v11H41zM28 52h10v11H28zm13 0h11v11H41zm14 0h11v11H55zm0-13h11v11H55zm14 13h11v11H69z"/>
    </svg>
  ),
  auth0: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#EB5424" d="M64 128L38.5 89.6l25.5-17 25.5 17z"/>
      <path fill="#EB5424" d="M89.5 89.6L64 0 38.5 89.6 64 72.6z"/>
      <path fill="#EB5424" d="M38.5 89.6L0 89.6l25.5-38.4z"/>
      <path fill="#EB5424" d="M89.5 89.6l38.5 0-25.5-38.4z"/>
      <path fill="#EB5424" d="M25.5 51.2L38.5 89.6 64 0z"/>
      <path fill="#EB5424" d="M102.5 51.2L89.5 89.6 64 0z"/>
    </svg>
  ),
  csharp: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#9B4993" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/>
      <path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/>
      <path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"/>
      <path fill="#fff" d="M82 64h5v4h-5v5h-4v-5h-5v-4h5v-5h4z"/>
      <path fill="#fff" d="M100 64h5v4h-5v5h-4v-5h-5v-4h5v-5h4z"/>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <g fill="#61DAFB">
        <circle cx="64" cy="64" r="11.4"/>
        <path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"/>
      </g>
    </svg>
  ),
  sql: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#F29111" d="M64 8c-33.1 0-60 12.4-60 27.6v56.8C4 107.6 30.9 120 64 120s60-12.4 60-27.6V35.6C124 20.4 97.1 8 64 8z"/>
      <ellipse fill="#FFE873" cx="64" cy="35.6" rx="56" ry="23.6"/>
      <path fill="#F29111" d="M64 8c-33.1 0-60 12.4-60 27.6 0 15.2 26.9 27.6 60 27.6s60-12.4 60-27.6C124 20.4 97.1 8 64 8zm0 47.2c-28.7 0-52-9.6-52-21.6S35.3 12 64 12s52 9.6 52 21.6-23.3 21.6-52 21.6z"/>
    </svg>
  ),
  git: (
    <svg viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#F34F29" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/>
    </svg>
  ),
}

// ============ PRELOADER ============
const Preloader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="preloader fixed inset-0 z-[200] bg-void flex items-center justify-center animate-fadeOut">
      <div className="flex items-center">
        <span className="text-[20vw] font-black sa-letter-s animate-scaleIn">S</span>
        <span className="text-[20vw] font-black sa-letter-a animate-scaleIn delay-100">A</span>
      </div>
    </div>
  )
}

// ============ TECH BADGE COMPONENT ============
const TechBadge = ({ name, icon }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass tech-badge">
    <div className="w-6 h-6">{icon}</div>
    <span className="text-sm text-white font-medium">{name}</span>
  </div>
)

// ============ MAIN HORIZONTAL SCROLL EXPERIENCE ============
export default function Home() {
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  useLayoutEffect(() => {
    if (loading || typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.panel')

      // Much shorter scroll distance for faster response
      const scrollDistance = window.innerWidth * 2

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 0.3, // Lower = more responsive
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [loading])

  const experiences = [
    {
      period: 'Nov 2025 - Present',
      role: 'Associate Director',
      company: 'Syneos Health',
      description: 'Leading 20 engineers across UI, middleware, data, and QA. Spearheading Precision Targeting, KOL Analytics, and AIP systems.',
      achievements: ['1,600% user growth', '3,001% engagement', 'Zero incidents'],
      tech: ['Azure', 'Kubernetes', 'Snowflake', 'KEDA', '.NET Core']
    },
    {
      period: 'Jul 2024 - Nov 2025',
      role: 'Principal Engineer',
      company: 'Syneos Health',
      description: 'Led 8-10 engineers delivering three major platforms with 99.9%+ uptime. Rewrote Node.js to .NET Core in 30 days.',
      achievements: ['30-day migration', '30% faster', 'GPT-4o integration'],
      tech: ['Svelte', '.NET Core', 'Snowflake', 'Auth0', 'OpenAI']
    },
    {
      period: 'Jun 2023 - Jun 2024',
      role: 'Senior Full Stack Developer',
      company: 'Syneos Health',
      description: 'Built KDB IDE with spreadsheet functionality, SSH views, and autocomplete. Created DEI reports tool with Plotly.',
      achievements: ['KDB IDE shipped', 'Excel-DNA add-ins', 'SSO enabled'],
      tech: ['WPF', 'WinForms', 'Excel-DNA', 'Plotly', 'Syncfusion']
    },
    {
      period: 'Mar 2021 - Jul 2022',
      role: 'Project Development Engineer',
      company: 'Open Systems International',
      description: 'Designed ASP.NET Web Forms, developed SQL stored procedures, and implemented secure web services.',
      achievements: ['Web services', 'SQL optimization', 'F# to C# conversion'],
      tech: ['ASP.NET', 'C#', 'SQL Server', 'JavaScript', 'XML']
    },
    {
      period: 'Jul 2018 - Mar 2021',
      role: 'Embedded Design Engineer',
      company: 'SUGUS',
      description: 'Developed TDS Meter for Bosch, counter meter for TVS Tires. Built HMI automation for RO plants.',
      achievements: ['Bosch TDS Meter', 'TVS Counter', 'HMI automation'],
      tech: ['Embedded C', 'MicroPython', 'Python', 'IoT', 'GitHub']
    }
  ]

  const techStack = [
    { name: '.NET Core', icon: TechIcons.dotnet, category: 'Backend' },
    { name: 'C#', icon: TechIcons.csharp, category: 'Backend' },
    { name: 'Python', icon: TechIcons.python, category: 'Backend' },
    { name: 'Azure', icon: TechIcons.azure, category: 'Cloud' },
    { name: 'Kubernetes', icon: TechIcons.kubernetes, category: 'Cloud' },
    { name: 'Docker', icon: TechIcons.docker, category: 'Cloud' },
    { name: 'Snowflake', icon: TechIcons.snowflake, category: 'Data' },
    { name: 'SQL', icon: TechIcons.sql, category: 'Data' },
    { name: 'Svelte', icon: TechIcons.svelte, category: 'Frontend' },
    { name: 'React', icon: TechIcons.react, category: 'Frontend' },
    { name: 'OpenAI', icon: TechIcons.openai, category: 'AI' },
    { name: 'Auth0', icon: TechIcons.auth0, category: 'Auth' },
    { name: 'Git', icon: TechIcons.git, category: 'DevOps' },
  ]

  return (
    <main ref={containerRef} className="bg-void text-white overflow-hidden">
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {!loading && (
        <>
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-dark">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-2xl font-black gradient-text">SA</div>
              <div className="hidden md:flex items-center gap-6 text-sm text-silver">
                <span>Scroll to explore →</span>
              </div>
              <a href="mailto:suganthan94@yahoo.com" className="px-4 py-2 rounded-full gradient-ember text-void font-semibold text-sm">
                Connect
              </a>
            </div>
          </nav>

          {/* Horizontal scrolling wrapper */}
          <div ref={wrapperRef} className="h-screen">
            <div className="flex h-screen">

              {/* Panel 1: Hero */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative will-change-transform">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-ember/15 rounded-full blur-[150px]" />
                  <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/15 rounded-full blur-[120px]" />
                </div>

                <div className="panel-content text-center px-6 relative z-10 max-w-5xl fade-in">
                  <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-2">
                    <span className="text-white">SUGANTHAN</span>
                  </h1>
                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-black gradient-text mb-6">
                    ARULVELAN
                  </h2>
                  <p className="text-lg md:text-xl text-silver max-w-2xl mx-auto mb-4">
                    Associate Director at Syneos Health
                  </p>
                  <p className="text-sm md:text-base text-silver/70 max-w-xl mx-auto">
                    Building Healthcare Analytics Platforms | Enterprise Architecture & AI Integration
                  </p>

                  {/* Impact Stats */}
                  <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10">
                    {[
                      { value: '1600%', label: 'User Growth' },
                      { value: '0', label: 'Incidents' },
                      { value: '99.9%', label: 'Uptime' },
                      { value: '20+', label: 'Engineers Led' },
                    ].map((stat, i) => (
                      <div key={i} className="text-center px-4">
                        <div className="text-2xl md:text-4xl font-black gradient-text">{stat.value}</div>
                        <div className="text-silver text-xs md:text-sm mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex justify-center gap-4 mt-8 text-xs text-silver/60">
                    <span>🇬🇧 English</span>
                    <span>•</span>
                    <span>🇮🇳 Tamil</span>
                    <span>•</span>
                    <span>🇫🇷 French</span>
                  </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-silver text-sm">
                  <span>Scroll</span>
                  <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </section>

              {/* Panel 2: About + Tech Stack */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative bg-obsidian will-change-transform">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-ember/5 to-transparent pointer-events-none" />

                <div className="panel-content max-w-6xl mx-auto px-6">
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                      <span className="text-ember font-mono text-sm tracking-widest">// ABOUT</span>
                      <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">
                        From Microcontrollers to <span className="gradient-text">Enterprise Platforms</span>
                      </h2>
                      <p className="text-silver leading-relaxed mb-6">
                        From programming microcontrollers to leading enterprise platform teams—my journey has been about solving progressively harder problems.
                      </p>
                      <p className="text-silver/80 leading-relaxed text-sm">
                        I care deeply about craft—clean architecture, proper abstractions, systems that don&apos;t break at 2 AM. Equally passionate about helping engineers grow from writing code to thinking in systems.
                      </p>

                      {/* Education */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-sm text-ember font-mono mb-3">// EDUCATION</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-white">M.E. Control Systems</span> <span className="text-silver">• Mahendra Institutions</span></div>
                          <div><span className="text-white">B.E. Electrical & Electronics</span> <span className="text-silver">• Mahendra Institutions</span></div>
                          <div><span className="text-white">ML Engineer Nanodegree</span> <span className="text-silver">• Udacity</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Tech Stack with Icons */}
                    <div>
                      <h3 className="text-sm text-gold font-mono mb-4">// TECH ARSENAL</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {techStack.map((tech, i) => (
                          <TechBadge key={i} name={tech.name} icon={tech.icon} />
                        ))}
                      </div>

                      {/* Additional Skills */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {['KEDA', 'Service Bus', 'KDB+', 'Databricks', 'WPF', 'Excel-DNA', 'Plotly', 'Syncfusion'].map((skill, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-white/5 rounded text-silver">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Panel 3: Experience Timeline */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative will-change-transform">
                <div className="panel-content max-w-5xl mx-auto px-6">
                  <div className="text-center mb-8">
                    <span className="text-gold font-mono text-sm tracking-widest">// EXPERIENCE</span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
                      Career <span className="gradient-text">Journey</span>
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {experiences.slice(0, 4).map((exp, i) => (
                      <div key={i} className="glass rounded-xl p-4 exp-card">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="md:w-36 flex-shrink-0">
                            <div className="text-ember font-mono text-xs">{exp.period}</div>
                            <div className="text-base font-bold text-white mt-1">{exp.role}</div>
                            <div className="text-silver text-sm">{exp.company}</div>
                          </div>
                          <div className="flex-grow">
                            <p className="text-silver text-sm leading-relaxed mb-2">{exp.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {exp.achievements.map((a, j) => (
                                <span key={j} className="text-xs px-2 py-1 bg-ember/20 text-ember rounded">{a}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Panel 4: Projects/Impact */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative bg-obsidian will-change-transform">
                <div className="panel-content max-w-6xl mx-auto px-6">
                  <div className="text-center mb-10">
                    <span className="text-cyan font-mono text-sm tracking-widest">// IMPACT</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mt-4">
                      What I <span className="gradient-text">Delivered</span>
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Precision Targeting',
                        metric: '1600%',
                        label: 'User Growth',
                        desc: 'First enterprise-standard platform. 150+ users across Commercial StratOps.',
                        tech: 'Svelte • .NET Core • Snowflake • Auth0'
                      },
                      {
                        title: 'AIP Modernization',
                        metric: '30',
                        label: 'Day Migration',
                        desc: 'Node.js to .NET Core. Zero downtime. Multi-database support unlocked.',
                        tech: '.NET Core • Snowflake • KDB+ • Databricks'
                      },
                      {
                        title: 'KOL Analytics',
                        metric: 'GPT-4o',
                        label: 'AI Powered',
                        desc: 'Distributed processing for 1-4 hour queries. KEDA autoscaling.',
                        tech: 'Kubernetes • KEDA • Azure Service Bus • OpenAI'
                      }
                    ].map((project, i) => (
                      <div key={i} className="glass rounded-2xl p-6 project-card">
                        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                        <div className="text-4xl font-black gradient-text">{project.metric}</div>
                        <div className="text-sm text-silver mb-3">{project.label}</div>
                        <p className="text-sm text-silver/80 mb-4">{project.desc}</p>
                        <div className="text-xs text-ember font-mono">{project.tech}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Panel 5: Contact */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative will-change-transform">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-ember/15 rounded-full blur-[200px]" />
                </div>

                <div className="panel-content max-w-4xl mx-auto px-6 text-center">
                  <span className="text-ember font-mono text-sm tracking-widest">// CONNECT</span>
                  <h2 className="text-3xl md:text-6xl font-black text-white mt-4 mb-4">
                    Let&apos;s Build<br/><span className="gradient-text">Together</span>
                  </h2>
                  <p className="text-silver max-w-lg mx-auto mb-8">
                    Always happy to connect with folks working on healthcare tech, distributed systems, or thoughtful AI integration.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                    <a href="mailto:suganthan94@yahoo.com" className="px-8 py-4 rounded-full gradient-ember text-void font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      suganthan94@yahoo.com
                    </a>
                    <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>

                  <div className="flex justify-center gap-8 text-silver text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Salem, Tamil Nadu
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +91 9080704073
                    </div>
                  </div>

                  <div className="mt-16 text-silver/50 text-sm">
                    © {new Date().getFullYear()} Suganthan Arulvelan. All rights reserved.
                  </div>
                </div>
              </section>

            </div>
          </div>

        </>
      )}
    </main>
  )
}
