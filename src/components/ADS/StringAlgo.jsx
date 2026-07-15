import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, SkipBack, SkipForward, RotateCcw, Code, Settings, AlignLeft, Info, Search } from 'lucide-react';

const InjectedStyles = () => (
  <style>{`
    :root {
      --bg-dark-950: #0c111c;
      --bg-dark-900: #111827;
      --bg-dark-800: #1f2937;
      --bg-dark-700: #374151;
      --bg-dark-600: #4b5563;
      
      --text-gray-100: #f3f4f6;
      --text-gray-200: #e5e7eb;
      --text-gray-300: #d1d5db;
      --text-gray-400: #9ca3af;
      --text-gray-500: #6b7280;

      --border-gray-600: #4b5563;
      --border-gray-700: #374151;

      --cyan-400: #22d3ee;
      --cyan-500: #06b6d4;
      --green-400: #4ade80;
      --green-500: #22c55e;
      --yellow-400: #facc15;
      --yellow-500: #eab308;
      --red-400: #f87171;
      --red-500: #ef4444;
      --purple-400: #c084fc;
      --purple-500: #a855f7;
      --blue-400: #60a5fa;
      --blue-500: #3b82f6;
    }

    .visualizer-container { font-family: 'Inter', -apple-system, sans-serif; background-color: var(--bg-dark-900); color: var(--text-gray-200); display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    @media (min-width: 1024px) { .visualizer-container { flex-direction: row; } }

    * { box-sizing: border-box; }

    .controls-sidebar { width: 100%; background-color: var(--bg-dark-800); padding: 1.25rem; border-right: 1px solid var(--border-gray-700); z-index: 10; display: flex; flex-direction: column; overflow-y: auto; }
    @media (min-width: 1024px) { .controls-sidebar { width: 320px; min-width: 320px; height: 100vh; } }

    .sidebar-title { font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--purple-400); display: flex; align-items: center; gap: 0.5rem; }

    .input-group { margin-bottom: 0.75rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-gray-400); text-transform: uppercase; }
    .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); font-size: 0.85rem; font-family: monospace; }
    .input-field:focus { outline: none; border-color: var(--purple-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-purple { background-color: var(--purple-600); color: white; }
    .btn-purple:hover:not(:disabled) { background-color: var(--purple-500); }
    .btn-secondary { background-color: var(--bg-dark-700); color: white; border: 1px solid var(--border-gray-600); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-600); }

    .playback-panel { background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--purple-500); margin-bottom: 1rem; }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--purple-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--purple-400); border-color: var(--purple-500); }
    
    .main-content { flex: 1; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; overflow-y: auto; background-color: var(--bg-dark-950); }
    .status-bar { padding: 0.75rem 1rem; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center; }
    .status-text { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: var(--cyan-400); }
    
    .top-layout { display: flex; flex-direction: column; gap: 1rem; flex: 2; min-height: 400px; }
    @media (min-width: 1280px) { .top-layout { flex-direction: row; } }
    
    .canvas-wrapper { flex: 2; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; position: relative; overflow: auto; padding: 2rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2rem; }
    .info-wrapper { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; min-width: 250px; }
    
    /* String Visualization Boxes */
    .string-row { display: flex; gap: 0.25rem; position: relative; }
    .char-box-container { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
    .char-box { width: 2.2rem; height: 2.2rem; display: flex; align-items: center; justify-content: center; font-family: 'Fira Code', monospace; font-size: 1.1rem; font-weight: bold; background: var(--bg-dark-800); border: 2px solid var(--border-gray-600); border-radius: 0.35rem; color: var(--text-gray-200); transition: all 0.2s ease; position: relative; }
    .char-idx { font-size: 0.6rem; color: var(--text-gray-500); font-family: monospace; }
    
    .char-box.comparing { border-color: var(--yellow-500); background: rgba(234,179,8,0.15); color: var(--yellow-400); transform: scale(1.1); z-index: 10; box-shadow: 0 0 10px rgba(234,179,8,0.3); }
    .char-box.match { border-color: var(--green-500); background: rgba(34,197,94,0.15); color: var(--green-400); }
    .char-box.mismatch { border-color: var(--red-500); background: rgba(239,68,68,0.15); color: var(--red-400); }
    .char-box.found { border-color: var(--cyan-400); background: rgba(34,211,238,0.2); color: var(--cyan-300); }
    .char-box.pointer-l { border-bottom: 4px solid var(--purple-500); }
    .char-box.pointer-r { border-bottom: 4px solid var(--cyan-500); }

    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--purple-400); }
    
    .array-table-container { padding: 1rem; overflow-y: auto; flex: 1; display: flex; flex-wrap: wrap; gap: 0.5rem; align-content: flex-start; }
    .array-cell { display: flex; flex-direction: column; align-items: center; background: var(--bg-dark-900); border: 1px solid var(--border-gray-600); border-radius: 0.25rem; padding: 0.2rem; min-width: 2.2rem; }
    .array-cell .idx { font-size: 0.6rem; color: var(--text-gray-500); border-bottom: 1px solid var(--border-gray-700); width: 100%; text-align: center; padding-bottom: 0.1rem; margin-bottom: 0.1rem; }
    .array-cell .val { font-size: 0.85rem; font-family: monospace; color: var(--cyan-400); font-weight: bold; }
    .array-cell.active { border-color: var(--yellow-500); background: rgba(234,179,8,0.1); box-shadow: 0 0 8px rgba(234,179,8,0.3); }
    
    .var-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.5rem; background: var(--bg-dark-950); border: 1px solid var(--border-gray-600); border-radius: 0.25rem; font-family: monospace; font-size: 0.8rem; margin: 0.2rem; }
    .var-badge span { color: var(--purple-400); font-weight: bold; }

    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 220px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(168, 85, 247, 0.25); border-left: 3px solid var(--purple-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); }
    .log-item.active { background: var(--bg-dark-700); color: var(--cyan-400); border-radius: 0.25rem; border-left: 2px solid var(--cyan-400); }
  `}</style>
);

const ALGO_CODES = {
  naive: {
    python: [
      "def naive_search(text, pat):",
      "    n, m = len(text), len(pat)",
      "    for i in range(n - m + 1):",
      "        j = 0",
      "        while j < m and text[i+j] == pat[j]:",
      "            j += 1",
      "        if j == m:",
      "            print(f'Found at index {i}')"
    ],
    cpp: [
      "void naive_search(string text, string pat) {",
      "    int n = text.length(), m = pat.length();",
      "    for (int i = 0; i <= n - m; i++) {",
      "        int j = 0;",
      "        while (j < m && text[i+j] == pat[j])",
      "            j++;",
      "        if (j == m)",
      "            cout << \"Found at index \" << i;",
      "    }",
      "}"
    ],
    java: [
      "void naiveSearch(String text, String pat) {",
      "    int n = text.length(), m = pat.length();",
      "    for (int i = 0; i <= n - m; i++) {",
      "        int j = 0;",
      "        while (j < m && text.charAt(i+j) == pat.charAt(j))",
      "            j++;",
      "        if (j == m)",
      "            System.out.println(\"Found at index \" + i);",
      "    }",
      "}"
    ]
  },
  lps: {
    python: [
      "def compute_LPS(pat):",
      "    m = len(pat)",
      "    lps = [0] * m",
      "    length, i = 0, 1",
      "    while i < m:",
      "        if pat[i] == pat[length]:",
      "            length += 1",
      "            lps[i] = length",
      "            i += 1",
      "        else:",
      "            if length != 0:",
      "                length = lps[length - 1]",
      "            else:",
      "                lps[i] = 0",
      "                i += 1",
      "    return lps"
    ],
    cpp: [
      "vector<int> compute_LPS(string pat) {",
      "    int m = pat.length();",
      "    vector<int> lps(m, 0);",
      "    int len = 0, i = 1;",
      "    while (i < m) {",
      "        if (pat[i] == pat[len]) {",
      "            len++;",
      "            lps[i] = len;",
      "            i++;",
      "        } else {",
      "            if (len != 0) len = lps[len - 1];",
      "            else {",
      "                lps[i] = 0;",
      "                i++;",
      "            }",
      "        }",
      "    }",
      "    return lps;",
      "}"
    ],
    java: [
      "int[] computeLPS(String pat) {",
      "    int m = pat.length();",
      "    int[] lps = new int[m];",
      "    int len = 0, i = 1;",
      "    while (i < m) {",
      "        if (pat.charAt(i) == pat.charAt(len)) {",
      "            len++;",
      "            lps[i] = len;",
      "            i++;",
      "        } else {",
      "            if (len != 0) len = lps[len - 1];",
      "            else {",
      "                lps[i] = 0;",
      "                i++;",
      "            }",
      "        }",
      "    }",
      "    return lps;",
      "}"
    ]
  },
  kmp: {
    python: [
      "def KMPSearch(pat, text):",
      "    n, m = len(text), len(pat)",
      "    lps = compute_LPS(pat)",
      "    i = j = 0",
      "    while i < n:",
      "        if pat[j] == text[i]:",
      "            i += 1",
      "            j += 1",
      "        if j == m:",
      "            print(f'Found at index {i-j}')",
      "            j = lps[j-1]",
      "        elif i < n and pat[j] != text[i]:",
      "            if j != 0: j = lps[j-1]",
      "            else: i += 1"
    ],
    cpp: [
      "void KMPSearch(string pat, string text) {",
      "    int n = text.length(), m = pat.length();",
      "    vector<int> lps = compute_LPS(pat);",
      "    int i = 0, j = 0;",
      "    while (i < n) {",
      "        if (pat[j] == text[i]) { i++; j++; }",
      "        if (j == m) {",
      "            cout << \"Found at index \" << i - j;",
      "            j = lps[j - 1];",
      "        } else if (i < n && pat[j] != text[i]) {",
      "            if (j != 0) j = lps[j - 1];",
      "            else i++;",
      "        }",
      "    }",
      "}"
    ],
    java: [
      "void KMPSearch(String pat, String text) {",
      "    int n = text.length(), m = pat.length();",
      "    int[] lps = computeLPS(pat);",
      "    int i = 0, j = 0;",
      "    while (i < n) {",
      "        if (pat.charAt(j) == text.charAt(i)) { i++; j++; }",
      "        if (j == m) {",
      "            System.out.println(\"Found at index \" + (i - j));",
      "            j = lps[j - 1];",
      "        } else if (i < n && pat.charAt(j) != text.charAt(i)) {",
      "            if (j != 0) j = lps[j - 1];",
      "            else i++;",
      "        }",
      "    }",
      "}"
    ]
  },
  rabinKarp: {
    python: [
      "def rabin_karp(pat, txt, d, q):",
      "    m, n = len(pat), len(txt)",
      "    p = t = 0",
      "    h = pow(d, m-1) % q",
      "    for i in range(m):",
      "        p = (d * p + ord(pat[i])) % q",
      "        t = (d * t + ord(txt[i])) % q",
      "    for i in range(n - m + 1):",
      "        if p == t:",
      "            if txt[i:i+m] == pat:",
      "                print(f'Found at index {i}')",
      "        if i < n - m:",
      "            t = (d*(t - ord(txt[i])*h) + ord(txt[i+m])) % q",
      "            if t < 0: t = t + q"
    ],
    cpp: [
      "void rabin_karp(string pat, string txt, int d, int q) {",
      "    int m = pat.length(), n = txt.length();",
      "    int p = 0, t = 0, h = 1;",
      "    for (int i = 0; i < m - 1; i++) h = (h * d) % q;",
      "    for (int i = 0; i < m; i++) {",
      "        p = (d * p + pat[i]) % q;",
      "        t = (d * t + txt[i]) % q;",
      "    }",
      "    for (int i = 0; i <= n - m; i++) {",
      "        if (p == t) {",
      "            if (txt.substr(i, m) == pat)",
      "                cout << \"Found at index \" << i;",
      "        }",
      "        if (i < n - m) {",
      "            t = (d*(t - txt[i]*h) + txt[i+m]) % q;",
      "            if (t < 0) t = t + q;",
      "        }",
      "    }",
      "}"
    ],
    java: [
      "void rabinKarp(String pat, String txt, int d, int q) {",
      "    int m = pat.length(), n = txt.length();",
      "    int p = 0, t = 0, h = 1;",
      "    for (int i = 0; i < m - 1; i++) h = (h * d) % q;",
      "    for (int i = 0; i < m; i++) {",
      "        p = (d * p + pat.charAt(i)) % q;",
      "        t = (d * t + txt.charAt(i)) % q;",
      "    }",
      "    for (int i = 0; i <= n - m; i++) {",
      "        if (p == t) {",
      "            if (txt.substring(i, i+m).equals(pat))",
      "                System.out.println(\"Found at index \" + i);",
      "        }",
      "        if (i < n - m) {",
      "            t = (d*(t - txt.charAt(i)*h) + txt.charAt(i+m)) % q;",
      "            if (t < 0) t = (t + q);",
      "        }",
      "    }",
      "}"
    ]
  },
  zAlgo: {
    python: [
      "def search_z(text, pat):",
      "    concat = pat + '$' + text",
      "    n = len(concat)",
      "    Z = [0] * n",
      "    L = R = 0",
      "    for i in range(1, n):",
      "        if i > R:",
      "            L = R = i",
      "            while R < n and concat[R-L] == concat[R]:",
      "                R += 1",
      "            Z[i] = R - L; R -= 1",
      "        else:",
      "            k = i - L",
      "            if Z[k] < R - i + 1: Z[i] = Z[k]",
      "            else:",
      "                L = i",
      "                while R < n and concat[R-L] == concat[R]: R += 1",
      "                Z[i] = R - L; R -= 1",
      "        if Z[i] == len(pat):",
      "            print(f'Found at index {i - len(pat) - 1}')"
    ],
    cpp: [
      "void search_z(string text, string pat) {",
      "    string concat = pat + \"$\" + text;",
      "    int n = concat.length();",
      "    vector<int> Z(n, 0);",
      "    int L = 0, R = 0;",
      "    for (int i = 1; i < n; i++) {",
      "        if (i > R) {",
      "            L = R = i;",
      "            while (R < n && concat[R - L] == concat[R]) R++;",
      "            Z[i] = R - L; R--;",
      "        } else {",
      "            int k = i - L;",
      "            if (Z[k] < R - i + 1) Z[i] = Z[k];",
      "            else {",
      "                L = i;",
      "                while (R < n && concat[R - L] == concat[R]) R++;",
      "                Z[i] = R - L; R--;",
      "            }",
      "        }",
      "        if (Z[i] == pat.length())",
      "            cout << \"Found at index \" << i - pat.length() - 1;",
      "    }",
      "}"
    ],
    java: [
      "void searchZ(String text, String pat) {",
      "    String concat = pat + \"$\" + text;",
      "    int n = concat.length();",
      "    int[] Z = new int[n];",
      "    int L = 0, R = 0;",
      "    for (int i = 1; i < n; i++) {",
      "        if (i > R) {",
      "            L = R = i;",
      "            while (R < n && concat.charAt(R - L) == concat.charAt(R)) R++;",
      "            Z[i] = R - L; R--;",
      "        } else {",
      "            int k = i - L;",
      "            if (Z[k] < R - i + 1) Z[i] = Z[k];",
      "            else {",
      "                L = i;",
      "                while (R < n && concat.charAt(R - L) == concat.charAt(R)) R++;",
      "                Z[i] = R - L; R--;",
      "            }",
      "        }",
      "        if (Z[i] == pat.length())",
      "            System.out.println(\"Found at index \" + (i - pat.length() - 1));",
      "    }",
      "}"
    ]
  },
  manacher: {
    python: [
      "def manacher(s):",
      "    T = '#' + '#'.join(s) + '#'",
      "    n = len(T)",
      "    P = [0] * n",
      "    C = R = 0",
      "    for i in range(n):",
      "        i_mirror = 2 * C - i",
      "        if R > i: P[i] = min(R - i, P[i_mirror])",
      "        while (i + 1 + P[i] < n and i - 1 - P[i] >= 0 and",
      "               T[i + 1 + P[i]] == T[i - 1 - P[i]]):",
      "            P[i] += 1",
      "        if i + P[i] > R:",
      "            C = i",
      "            R = i + P[i]",
      "    # Find max in P for longest palindrome",
      "    return P"
    ],
    cpp: [
      "vector<int> manacher(string s) {",
      "    string T = \"#\";",
      "    for(char c: s) { T += c; T += \"#\"; }",
      "    int n = T.length();",
      "    vector<int> P(n, 0);",
      "    int C = 0, R = 0;",
      "    for (int i = 0; i < n; i++) {",
      "        int i_mirror = 2 * C - i;",
      "        if (R > i) P[i] = min(R - i, P[i_mirror]);",
      "        while (i + 1 + P[i] < n && i - 1 - P[i] >= 0 &&",
      "               T[i + 1 + P[i]] == T[i - 1 - P[i]])",
      "            P[i]++;",
      "        if (i + P[i] > R) {",
      "            C = i;",
      "            R = i + P[i];",
      "        }",
      "    }",
      "    return P;",
      "}"
    ],
    java: [
      "int[] manacher(String s) {",
      "    StringBuilder sb = new StringBuilder(\"#\");",
      "    for(char c: s.toCharArray()) { sb.append(c).append(\"#\"); }",
      "    String T = sb.toString();",
      "    int n = T.length();",
      "    int[] P = new int[n];",
      "    int C = 0, R = 0;",
      "    for (int i = 0; i < n; i++) {",
      "        int i_mirror = 2 * C - i;",
      "        if (R > i) P[i] = Math.min(R - i, P[i_mirror]);",
      "        while (i + 1 + P[i] < n && i - 1 - P[i] >= 0 &&",
      "               T.charAt(i + 1 + P[i]) == T.charAt(i - 1 - P[i]))",
      "            P[i]++;",
      "        if (i + P[i] > R) {",
      "            C = i;",
      "            R = i + P[i];",
      "        }",
      "    }",
      "    return P;",
      "}"
    ]
  }
};

const LINE_MAPS = {
  naive: {
    python: { outer: 3, innerLoop: 5, match: 5, mismatch: 5, checkFound: 7, found: 8 },
    cpp: { outer: 3, innerLoop: 5, match: 5, mismatch: 5, checkFound: 7, found: 8 },
    java: { outer: 3, innerLoop: 5, match: 5, mismatch: 5, checkFound: 7, found: 8 }
  },
  lps: {
    python: { init: 4, loop: 5, match: 6, incrLen: 7, setLPS: 8, mismatch: 10, fallback: 12, reset: 14 },
    cpp: { init: 4, loop: 5, match: 6, incrLen: 7, setLPS: 8, mismatch: 10, fallback: 11, reset: 13 },
    java: { init: 4, loop: 5, match: 6, incrLen: 7, setLPS: 8, mismatch: 10, fallback: 11, reset: 13 }
  },
  kmp: {
    python: { loop: 5, match: 6, checkFound: 9, found: 10, resetJ: 11, mismatch: 12, fallbackJ: 13, incrI: 14 },
    cpp: { loop: 5, match: 6, checkFound: 7, found: 8, resetJ: 9, mismatch: 10, fallbackJ: 11, incrI: 12 },
    java: { loop: 5, match: 6, checkFound: 7, found: 8, resetJ: 9, mismatch: 10, fallbackJ: 11, incrI: 12 }
  },
  rabinKarp: {
    python: { initHash: 5, slideWin: 8, checkHash: 9, checkStr: 10, found: 11, rehash: 13 },
    cpp: { initHash: 5, slideWin: 9, checkHash: 10, checkStr: 11, found: 12, rehash: 15 },
    java: { initHash: 5, slideWin: 9, checkHash: 10, checkStr: 11, found: 12, rehash: 15 }
  },
  zAlgo: {
    python: { concat: 2, loop: 6, outside: 7, expandOutside: 9, inside: 12, copy: 14, expandInside: 17, checkFound: 19, found: 20 },
    cpp: { concat: 2, loop: 6, outside: 7, expandOutside: 9, inside: 12, copy: 14, expandInside: 17, checkFound: 20, found: 21 },
    java: { concat: 2, loop: 6, outside: 7, expandOutside: 9, inside: 12, copy: 14, expandInside: 17, checkFound: 20, found: 21 }
  },
  manacher: {
    python: { transform: 2, loop: 6, mirror: 7, initP: 8, expand: 10, updateCR: 12 },
    cpp: { transform: 2, loop: 7, mirror: 8, initP: 9, expand: 11, updateCR: 13 },
    java: { transform: 2, loop: 8, mirror: 9, initP: 10, expand: 12, updateCR: 14 }
  }
};

const generateNaiveFrames = (text, pat) => {
  const frames = [];
  const n = text.length, m = pat.length;
  let matches = [];
  
  for (let i = 0; i <= n - m; i++) {
    frames.push({ logMsg: `Shift pattern to offset ${i}.`, lineKey: 'outer', offset: i, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches] });
    let j = 0;
    while (j < m) {
      frames.push({ logMsg: `Comparing text[${i+j}] ('${text[i+j]}') with pat[${j}] ('${pat[j]}').`, lineKey: 'innerLoop', offset: i, tIdx: i+j, pIdx: j, status: 'comparing', matches: [...matches] });
      
      if (text[i+j] === pat[j]) {
        frames.push({ logMsg: `Match at text[${i+j}].`, lineKey: 'match', offset: i, tIdx: i+j, pIdx: j, status: 'match', matches: [...matches] });
        j++;
      } else {
        frames.push({ logMsg: `Mismatch at text[${i+j}]. Breaking inner loop.`, lineKey: 'mismatch', offset: i, tIdx: i+j, pIdx: j, status: 'mismatch', matches: [...matches] });
        break;
      }
    }
    frames.push({ logMsg: `Check if full pattern matched (j == ${m}).`, lineKey: 'checkFound', offset: i, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches] });
    if (j === m) {
      matches.push(i);
      frames.push({ logMsg: `Pattern found at index ${i}!`, lineKey: 'found', offset: i, tIdx: i, pIdx: m-1, status: 'found', matches: [...matches] });
    }
  }
  frames.push({ logMsg: `Naive Search complete. Found ${matches.length} matches.`, lineKey: null, offset: -1, tIdx: -1, pIdx: -1, status: 'idle', matches });
  return frames;
};

const generateLpsFrames = (pat) => {
  const frames = [];
  const m = pat.length;
  let lps = Array(m).fill(0);
  let len = 0, i = 1;
  
  frames.push({ logMsg: `Initialize LPS array of size ${m}. len=0, i=1.`, lineKey: 'init', tIdx: -1, pIdx: -1, ds: {lps: [...lps]}, vars: {len, i} });
  
  while (i < m) {
    frames.push({ logMsg: `Comparing pat[${i}] ('${pat[i]}') and pat[${len}] ('${pat[len]}').`, lineKey: 'loop', tIdx: i, pIdx: len, status: 'comparing', ds: {lps: [...lps]}, vars: {len, i} });
    
    if (pat[i] === pat[len]) {
      len++;
      frames.push({ logMsg: `Match! Increment len to ${len}.`, lineKey: 'incrLen', tIdx: i, pIdx: len-1, status: 'match', ds: {lps: [...lps]}, vars: {len, i} });
      lps[i] = len;
      frames.push({ logMsg: `Set lps[${i}] = ${len}. Increment i.`, lineKey: 'setLPS', tIdx: i, pIdx: -1, status: 'idle', ds: {lps: [...lps]}, vars: {len, i: i+1}, activeDsIdx: i });
      i++;
    } else {
      frames.push({ logMsg: `Mismatch! pat[${i}] != pat[${len}].`, lineKey: 'mismatch', tIdx: i, pIdx: len, status: 'mismatch', ds: {lps: [...lps]}, vars: {len, i} });
      if (len !== 0) {
        len = lps[len - 1];
        frames.push({ logMsg: `len != 0. Fallback len to lps[${len}] (${len}).`, lineKey: 'fallback', tIdx: i, pIdx: -1, status: 'idle', ds: {lps: [...lps]}, vars: {len, i} });
      } else {
        lps[i] = 0;
        frames.push({ logMsg: `len == 0. Set lps[${i}] = 0. Increment i.`, lineKey: 'reset', tIdx: i, pIdx: -1, status: 'idle', ds: {lps: [...lps]}, vars: {len, i: i+1}, activeDsIdx: i });
        i++;
      }
    }
  }
  frames.push({ logMsg: `LPS Array construction complete.`, lineKey: null, tIdx: -1, pIdx: -1, status: 'idle', ds: {lps: [...lps]}, vars: {len, i} });
  return frames;
};

const generateKmpFrames = (text, pat) => {
  const frames = [];
  const n = text.length, m = pat.length;
  // Compute LPS silently for the algorithm logic, but show the final array in DS.
  let lps = Array(m).fill(0);
  for(let i=1, len=0; i<m; ) {
    if(pat[i] === pat[len]) lps[i++] = ++len;
    else if(len !== 0) len = lps[len-1];
    else lps[i++] = 0;
  }
  
  let matches = [];
  let i = 0, j = 0;
  
  frames.push({ logMsg: `Start KMP. LPS array pre-computed. i=0, j=0.`, lineKey: 'loop', offset: 0, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches], ds: {lps}, vars: {i, j} });
  
  while (i < n) {
    frames.push({ logMsg: `Comparing text[${i}] ('${text[i]}') and pat[${j}] ('${pat[j]}').`, lineKey: 'loop', offset: i - j, tIdx: i, pIdx: j, status: 'comparing', matches: [...matches], ds: {lps}, vars: {i, j} });
    
    if (pat[j] === text[i]) {
      frames.push({ logMsg: `Match! i++, j++.`, lineKey: 'match', offset: i - j, tIdx: i, pIdx: j, status: 'match', matches: [...matches], ds: {lps}, vars: {i: i+1, j: j+1} });
      i++; j++;
    }
    
    frames.push({ logMsg: `Check if full pattern found (j == ${m}).`, lineKey: 'checkFound', offset: i - j, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches], ds: {lps}, vars: {i, j} });
    if (j === m) {
      matches.push(i - j);
      frames.push({ logMsg: `Pattern found at index ${i - j}!`, lineKey: 'found', offset: i - j, tIdx: i-1, pIdx: m-1, status: 'found', matches: [...matches], ds: {lps}, vars: {i, j} });
      j = lps[j - 1];
      frames.push({ logMsg: `Reset j to lps[${j-1}] = ${j}. Shift pattern.`, lineKey: 'resetJ', offset: i - j, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches], ds: {lps}, vars: {i, j}, activeDsIdx: j-1 });
    } else if (i < n && pat[j] !== text[i]) {
      frames.push({ logMsg: `Mismatch after ${j} matches.`, lineKey: 'mismatch', offset: i - j, tIdx: i, pIdx: j, status: 'mismatch', matches: [...matches], ds: {lps}, vars: {i, j} });
      if (j !== 0) {
        let oldJ = j;
        j = lps[j - 1];
        frames.push({ logMsg: `j != 0. Fallback j to lps[${oldJ-1}] = ${j}. Shift pattern.`, lineKey: 'fallbackJ', offset: i - j, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches], ds: {lps}, vars: {i, j}, activeDsIdx: oldJ-1 });
      } else {
        frames.push({ logMsg: `j == 0. Cannot fallback. Increment i.`, lineKey: 'incrI', offset: i - j + 1, tIdx: i, pIdx: -1, status: 'idle', matches: [...matches], ds: {lps}, vars: {i: i+1, j} });
        i++;
      }
    }
  }
  frames.push({ logMsg: `KMP Search complete. Found ${matches.length} matches.`, lineKey: null, offset: -1, tIdx: -1, pIdx: -1, status: 'idle', matches, ds: {lps}, vars: {i, j} });
  return frames;
};

const generateRabinKarpFrames = (text, pat) => {
  const frames = [];
  const n = text.length, m = pat.length;
  if (m > n || m === 0) return [{ logMsg: 'Invalid lengths.', lineKey: null, offset:-1, status:'idle' }];
  
  const d = 10; const q = 13; // Small modulus and base for visualization
  let matches = [];
  let h = 1;
  for(let i=0; i<m-1; i++) h = (h * d) % q;
  
  let p = 0, t = 0;
  for(let i=0; i<m; i++) {
    p = (d * p + pat.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  
  frames.push({ logMsg: `Calculated initial hashes. Pattern Hash: ${p}, Window Hash: ${t}.`, lineKey: 'initHash', offset: 0, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches], ds: {hashP: p, hashT: t, q, d} });
  
  for (let i = 0; i <= n - m; i++) {
    frames.push({ logMsg: `Shift ${i}: Checking Hash(Pattern) == Hash(Window) (${p} == ${t})`, lineKey: 'checkHash', offset: i, tIdx: -1, pIdx: -1, status: 'idle', matches: [...matches], ds: {hashP: p, hashT: t} });
    
    if (p === t) {
      frames.push({ logMsg: `Hashes match! Fallback to string comparison.`, lineKey: 'checkStr', offset: i, tIdx: i, pIdx: 0, status: 'comparing', matches: [...matches], ds: {hashP: p, hashT: t} });
      let matchStr = true;
      for (let j = 0; j < m; j++) {
        if (text[i+j] !== pat[j]) {
          matchStr = false;
          frames.push({ logMsg: `Spurious hit! Characters mismatch at pat[${j}].`, lineKey: 'checkStr', offset: i, tIdx: i+j, pIdx: j, status: 'mismatch', matches: [...matches], ds: {hashP: p, hashT: t} });
          break;
        } else {
          frames.push({ logMsg: `Characters match.`, lineKey: 'checkStr', offset: i, tIdx: i+j, pIdx: j, status: 'match', matches: [...matches], ds: {hashP: p, hashT: t} });
        }
      }
      if (matchStr) {
        matches.push(i);
        frames.push({ logMsg: `Exact match confirmed at index ${i}.`, lineKey: 'found', offset: i, tIdx: i, pIdx: m-1, status: 'found', matches: [...matches], ds: {hashP: p, hashT: t} });
      }
    } else {
      frames.push({ logMsg: `Hashes mismatch. Skipping string comparison.`, lineKey: 'checkHash', offset: i, tIdx: -1, pIdx: -1, status: 'mismatch', matches: [...matches], ds: {hashP: p, hashT: t} });
    }
    
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t = t + q;
      frames.push({ logMsg: `Rolling hash updated. Removed '${text[i]}', added '${text[i+m]}'. New Hash: ${t}.`, lineKey: 'rehash', offset: i+1, tIdx: i+m, pIdx: -1, status: 'idle', matches: [...matches], ds: {hashP: p, hashT: t} });
    }
  }
  frames.push({ logMsg: `Rabin-Karp Search complete.`, lineKey: null, offset: -1, tIdx: -1, pIdx: -1, status: 'idle', matches, ds: {hashP: p, hashT: t} });
  return frames;
};

const generateZAlgoFrames = (text, pat) => {
  const frames = [];
  const S = pat + '$' + text;
  const n = S.length;
  let Z = Array(n).fill(0);
  let L = 0, R = 0;
  let matches = [];
  
  frames.push({ logMsg: `Concatenated string: S = pat + '$' + text. Length: ${n}.`, lineKey: 'concat', offset: 0, ds: {Z: [...Z]}, vars: {L, R, S} });
  
  for (let i = 1; i < n; i++) {
    frames.push({ logMsg: `Processing i=${i} ('${S[i]}'). Current window [L=${L}, R=${R}].`, lineKey: 'loop', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i} });
    
    if (i > R) {
      L = R = i;
      frames.push({ logMsg: `i > R (outside window). Reset L=R=${i}. Begin expanding.`, lineKey: 'outside', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i} });
      while (R < n && S[R - L] === S[R]) {
        frames.push({ logMsg: `S[${R-L}] == S[${R}]. Expand R to ${R+1}.`, lineKey: 'expandOutside', offset: i, tIdx: R, pIdx: R-L, status: 'match', ds: {Z: [...Z]}, vars: {L, R, S, i} });
        R++;
      }
      if(R < n) frames.push({ logMsg: `Mismatch at S[${R}]. Stop expanding.`, lineKey: 'expandOutside', offset: i, tIdx: R, pIdx: R-L, status: 'mismatch', ds: {Z: [...Z]}, vars: {L, R, S, i} });
      
      Z[i] = R - L; R--;
      frames.push({ logMsg: `Set Z[${i}] = ${Z[i]}. Decrement R to ${R}.`, lineKey: 'outside', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i}, activeDsIdx: i });
    } else {
      let k = i - L;
      frames.push({ logMsg: `i <= R (inside window). Look up Z[k] where k = i - L = ${k}. Z[${k}] = ${Z[k]}.`, lineKey: 'inside', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i, k}, activeDsIdx: k });
      
      if (Z[k] < R - i + 1) {
        Z[i] = Z[k];
        frames.push({ logMsg: `Z[${k}] < remaining window (${R - i + 1}). Copy Z[${i}] = ${Z[k]}.`, lineKey: 'copy', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i, k}, activeDsIdx: i });
      } else {
        L = i;
        frames.push({ logMsg: `Z[${k}] >= remaining window. Set L = ${i} and expand.`, lineKey: 'expandInside', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i, k} });
        while (R < n && S[R - L] === S[R]) {
          frames.push({ logMsg: `S[${R-L}] == S[${R}]. Expand R to ${R+1}.`, lineKey: 'expandInside', offset: i, tIdx: R, pIdx: R-L, status: 'match', ds: {Z: [...Z]}, vars: {L, R, S, i} });
          R++;
        }
        if(R < n) frames.push({ logMsg: `Mismatch at S[${R}]. Stop expanding.`, lineKey: 'expandInside', offset: i, tIdx: R, pIdx: R-L, status: 'mismatch', ds: {Z: [...Z]}, vars: {L, R, S, i} });
        
        Z[i] = R - L; R--;
        frames.push({ logMsg: `Set Z[${i}] = ${Z[i]}. Decrement R to ${R}.`, lineKey: 'expandInside', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i}, activeDsIdx: i });
      }
    }
    
    frames.push({ logMsg: `Check if Z[${i}] == pat.length (${pat.length}).`, lineKey: 'checkFound', offset: i, ds: {Z: [...Z]}, vars: {L, R, S, i} });
    if (Z[i] === pat.length) {
      let matchIdx = i - pat.length - 1;
      matches.push(matchIdx);
      frames.push({ logMsg: `Pattern found in original text at index ${matchIdx}!`, lineKey: 'found', offset: i, tIdx: i, status: 'found', matches: [...matches], ds: {Z: [...Z]}, vars: {L, R, S, i}, activeDsIdx: i });
    }
  }
  frames.push({ logMsg: `Z-Algorithm complete. Found ${matches.length} matches.`, lineKey: null, offset: -1, ds: {Z: [...Z]}, vars: {L, R, S}, matches });
  return frames;
};

const generateManacherFrames = (text) => {
  const frames = [];
  let T = '#';
  for(let char of text) { T += char + '#'; }
  const n = T.length;
  let P = Array(n).fill(0);
  let C = 0, R = 0;
  
  frames.push({ logMsg: `Transformed string T: inserted '#' between characters. Length: ${n}.`, lineKey: 'transform', ds: {P: [...P]}, vars: {C, R, T} });
  
  for (let i = 0; i < n; i++) {
    let i_mirror = 2 * C - i;
    frames.push({ logMsg: `Processing center i=${i} ('${T[i]}'). Current palindrome bound [C=${C}, R=${R}]. i_mirror = ${i_mirror}.`, lineKey: 'loop', tIdx: i, status: 'comparing', ds: {P: [...P]}, vars: {C, R, T, i, i_mirror} });
    
    if (R > i) {
      P[i] = Math.min(R - i, P[i_mirror]);
      frames.push({ logMsg: `i < R. Set P[${i}] = min(R-i, P[${i_mirror}]) = ${P[i]}.`, lineKey: 'initP', tIdx: i, pIdx: i_mirror, status: 'idle', ds: {P: [...P]}, vars: {C, R, T, i, i_mirror}, activeDsIdx: i });
    } else {
      frames.push({ logMsg: `i >= R. Start P[${i}] at 0.`, lineKey: 'initP', tIdx: i, status: 'idle', ds: {P: [...P]}, vars: {C, R, T, i, i_mirror} });
    }
    
    while (i + 1 + P[i] < n && i - 1 - P[i] >= 0 && T[i + 1 + P[i]] === T[i - 1 - P[i]]) {
      frames.push({ logMsg: `Expand around i=${i}: T[${i+1+P[i]}] == T[${i-1-P[i]}].`, lineKey: 'expand', tIdx: i+1+P[i], pIdx: i-1-P[i], status: 'match', ds: {P: [...P]}, vars: {C, R, T, i} });
      P[i]++;
    }
    if (i + 1 + P[i] < n && i - 1 - P[i] >= 0) {
      frames.push({ logMsg: `Mismatch at T[${i+1+P[i]}] != T[${i-1-P[i]}]. Stop expanding.`, lineKey: 'expand', tIdx: i+1+P[i], pIdx: i-1-P[i], status: 'mismatch', ds: {P: [...P]}, vars: {C, R, T, i} });
    }
    
    if (i + P[i] > R) {
      C = i; R = i + P[i];
      frames.push({ logMsg: `New palindrome goes beyond R. Update C = ${C}, R = ${R}.`, lineKey: 'updateCR', tIdx: i, status: 'found', ds: {P: [...P]}, vars: {C, R, T, i}, activeDsIdx: i });
    }
  }
  frames.push({ logMsg: `Manacher's Algorithm complete. P array holds palindrome radii.`, lineKey: null, ds: {P: [...P]}, vars: {C, R, T} });
  return frames;
};

export default function StringAlgoVisualizer() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [activeAlgo, setActiveAlgo] = useState("naive");
  const [language, setLanguage] = useState("python");
  
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0 && frameIdx < frames.length - 1) {
      timer = setTimeout(() => setFrameIdx(p => p + 1), speed);
    } else if (frameIdx >= frames.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames, speed]);

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [frameIdx]);

  const resetSim = () => { setFrames([]); setFrameIdx(-1); setIsPlaying(false); };

  const handleTextChange = (e) => { setText(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 20)); resetSim(); };
  const handlePatternChange = (e) => { setPattern(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 10)); resetSim(); };

  const executeAlgorithm = () => {
    resetSim();
    if (!text && activeAlgo !== 'lps') return;
    if (!pattern && activeAlgo !== 'manacher') return;
    
    let newFrames = [];
    if (activeAlgo === 'naive') newFrames = generateNaiveFrames(text, pattern);
    if (activeAlgo === 'lps') newFrames = generateLpsFrames(pattern);
    if (activeAlgo === 'kmp') newFrames = generateKmpFrames(text, pattern);
    if (activeAlgo === 'rabinKarp') newFrames = generateRabinKarpFrames(text, pattern);
    if (activeAlgo === 'zAlgo') newFrames = generateZAlgoFrames(text, pattern);
    if (activeAlgo === 'manacher') newFrames = generateManacherFrames(text);
    
    setFrames(newFrames); setFrameIdx(0); setIsPlaying(true);
  };

  const currFrame = frames[frameIdx] || { logMsg: 'Ready. Compile & Run to visualize.', lineKey: null, tIdx: -1, pIdx: -1, offset: -1, status: 'idle', matches: [], ds: {}, vars: {} };
  const highlightLine = currFrame.lineKey ? LINE_MAPS[activeAlgo][language][currFrame.lineKey] : -1;
  const isLocked = frames.length > 0;
  
  const disableText = activeAlgo === 'lps';
  const disablePat = activeAlgo === 'manacher';

  // Rendering Helpers
  const renderCharBox = (char, idx, isActive, statusClass, customLabel) => (
    <div key={idx} className="char-box-container">
      <div className={`char-box ${isActive ? statusClass : ''} ${customLabel === 'L' ? 'pointer-l' : ''} ${customLabel === 'R' ? 'pointer-r' : ''}`}>
        {char}
      </div>
      <span className="char-idx">{customLabel || idx}</span>
    </div>
  );

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      {}
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><Search size={24} /> String Algos</h1>
        
        <div className="playback-panel">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button onClick={executeAlgorithm} className="btn btn-purple" disabled={isLocked || (!text && !disableText) || (!pattern && !disablePat)}>
              <Play size={16}/> Compile
            </button>
            <button onClick={resetSim} className="btn btn-secondary" disabled={!isLocked} title="Reset Simulation">
              <RefreshCw size={16}/> Reset
            </button>
          </div>
          
          <input type="range" className="slider" min="-1" max={frames.length ? frames.length-1 : 0} value={frameIdx} onChange={e => {setFrameIdx(Number(e.target.value)); setIsPlaying(false);}} disabled={!isLocked} />
          
          <div className="player-controls">
            <button className="ctrl-btn" onClick={() => {setFrameIdx(-1); setIsPlaying(false);}} disabled={frameIdx <= -1}><RotateCcw size={16}/></button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p-1); setIsPlaying(false);}} disabled={frameIdx <= 0}><SkipBack size={16}/></button>
            <button className="ctrl-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={!isLocked || frameIdx === frames.length-1}>
              {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button className="ctrl-btn" onClick={() => {setFrameIdx(p=>p+1); setIsPlaying(false);}} disabled={!isLocked || frameIdx >= frames.length-1}><SkipForward size={16}/></button>
          </div>
          
          <div style={{marginTop: '0.75rem'}}>
            <label style={{fontSize:'0.65rem', color:'var(--purple-400)', display:'flex', justifyContent:'space-between'}}><span>Speed</span> <span>{speed}ms</span></label>
            <input type="range" min="100" max="1500" step="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="slider" style={{margin:0}} />
          </div>
        </div>

        <div className="input-group">
          <label>Algorithm</label>
          <select value={activeAlgo} onChange={e => {setActiveAlgo(e.target.value); resetSim();}} className="input-field" disabled={isLocked}>
            <option value="naive">Naive String Matching</option>
            <option value="lps">LPS Formation (for KMP)</option>
            <option value="kmp">KMP Search</option>
            <option value="rabinKarp">Rabin-Karp Search</option>
            <option value="zAlgo">Z Algorithm</option>
            <option value="manacher">Manacher's Algorithm</option>
          </select>
        </div>

        <div className="input-group">
          <label>Text String {disableText && '(Ignored)'} (Max 20)</label>
          <input type="text" value={text} onChange={handleTextChange} className="input-field" disabled={isLocked || disableText} placeholder="e.g. ABABDABACD..." />
        </div>
        
        <div className="input-group">
          <label>Pattern {disablePat && '(Ignored)'} (Max 10)</label>
          <input type="text" value={pattern} onChange={handlePatternChange} className="input-field" disabled={isLocked || disablePat} placeholder="e.g. ABABCABAB" />
        </div>
      </aside>

      {}
      <main className="main-content">
        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
          <div style={{display:'flex', gap:'0.25rem', flexWrap:'wrap'}}>
            {currFrame.vars && Object.entries(currFrame.vars).map(([k,v]) => {
              if (k==='S' || k==='T') return null; // Don't show full strings as badges
              return <div key={k} className="var-badge"><span>{k}:</span>{v}</div>
            })}
            {currFrame.ds && currFrame.ds.hashP !== undefined && <div className="var-badge"><span>Hash(Pat):</span>{currFrame.ds.hashP}</div>}
            {currFrame.ds && currFrame.ds.hashT !== undefined && <div className="var-badge"><span>Hash(Win):</span>{currFrame.ds.hashT}</div>}
          </div>
        </div>

        <div className="top-layout">
          {/* Canvas */}
          <div className="canvas-wrapper">
            <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'0.5rem'}}><AlignLeft size={14}/> VISUALIZATION</div>
            
            {/* Z-Algo renders a single concatenated string */}
            {activeAlgo === 'zAlgo' && currFrame.vars && currFrame.vars.S && (
              <div className="string-row">
                {currFrame.vars.S.split('').map((char, idx) => {
                  let isActive = (currFrame.tIdx === idx || currFrame.offset === idx);
                  let isPatternChar = (currFrame.pIdx === idx);
                  let finalActive = isActive || isPatternChar;
                  let status = finalActive ? currFrame.status : '';
                  if (currFrame.matches && currFrame.matches.includes(idx - pattern.length - 1)) status = 'found';
                  let label = idx;
                  if (idx === currFrame.vars.L) label = 'L';
                  if (idx === currFrame.vars.R) label = 'R';
                  if (idx === currFrame.vars.L && idx === currFrame.vars.R) label = 'L,R';
                  return renderCharBox(char, idx, finalActive, status, label);
                })}
              </div>
            )}

            {/* Manacher's renders a single transformed string */}
            {activeAlgo === 'manacher' && currFrame.vars && currFrame.vars.T && (
              <div className="string-row" style={{flexWrap: 'wrap'}}>
                {currFrame.vars.T.split('').map((char, idx) => {
                  let isActive = (currFrame.tIdx === idx || currFrame.pIdx === idx);
                  let status = isActive ? currFrame.status : '';
                  if (currFrame.vars.C === idx) status = 'found';
                  let label = idx;
                  if (idx === currFrame.vars.C) label = 'C';
                  if (idx === currFrame.vars.R) label = 'R';
                  if (idx === currFrame.vars.i_mirror) label = 'mir';
                  return renderCharBox(char, idx, isActive, status, label);
                })}
              </div>
            )}

            {/* Default Two-String View (Text and Pattern) */}
            {activeAlgo !== 'zAlgo' && activeAlgo !== 'manacher' && (
              <>
                {!disableText && (
                  <div className="string-row">
                    <span style={{position:'absolute', left:'-3rem', top:'0.6rem', fontSize:'0.75rem', fontWeight:'bold', color:'var(--text-gray-500)'}}>TEXT</span>
                    {text.split('').map((char, idx) => {
                      let isActive = currFrame.tIdx === idx;
                      let isFound = currFrame.matches && currFrame.matches.some(m => idx >= m && idx < m + pattern.length);
                      return renderCharBox(char, idx, isActive || isFound, isActive ? currFrame.status : isFound ? 'found' : '');
                    })}
                  </div>
                )}
                
                <div className="string-row" style={{marginLeft: currFrame.offset > 0 && !disableText ? `${currFrame.offset * 2.45}rem` : '0', transition: 'margin 0.3s ease'}}>
                  <span style={{position:'absolute', left:'-3rem', top:'0.6rem', fontSize:'0.75rem', fontWeight:'bold', color:'var(--purple-400)'}}>PAT</span>
                  {pattern.split('').map((char, idx) => {
                    let isActive = currFrame.pIdx === idx;
                    // For KMP/Naive, pattern might be shifted but pIdx relative.
                    let status = isActive ? currFrame.status : '';
                    if (activeAlgo === 'lps' && currFrame.tIdx === idx) { isActive = true; status = currFrame.status; }
                    return renderCharBox(char, idx, isActive, status);
                  })}
                </div>
              </>
            )}
          </div>

          {}
          <div className="info-wrapper">
            <div className="ds-header">
              {activeAlgo === 'lps' || activeAlgo === 'kmp' ? 'LPS Array (π)' : 
               activeAlgo === 'zAlgo' ? 'Z Array' : 
               activeAlgo === 'manacher' ? 'P Array (Palindrome Radii)' : 
               activeAlgo === 'rabinKarp' ? 'Hash Values' : 'Data Structures'}
            </div>
            
            <div className="array-table-container">
              {currFrame.ds && currFrame.ds.lps && currFrame.ds.lps.map((val, idx) => (
                <div key={idx} className={`array-cell ${currFrame.activeDsIdx === idx ? 'active' : ''}`}>
                  <span className="idx">{idx}</span><span className="val">{val}</span>
                </div>
              ))}
              
              {currFrame.ds && currFrame.ds.Z && currFrame.ds.Z.map((val, idx) => (
                <div key={idx} className={`array-cell ${currFrame.activeDsIdx === idx ? 'active' : ''}`}>
                  <span className="idx">{idx}</span><span className="val">{val}</span>
                </div>
              ))}
              
              {currFrame.ds && currFrame.ds.P && currFrame.ds.P.map((val, idx) => (
                <div key={idx} className={`array-cell ${currFrame.activeDsIdx === idx ? 'active' : ''}`}>
                  <span className="idx">{idx}</span><span className="val">{val}</span>
                </div>
              ))}

              {currFrame.ds && currFrame.ds.hashP !== undefined && (
                <div style={{width:'100%', padding:'1rem', display:'flex', flexDirection:'column', gap:'1rem', fontFamily:'monospace', fontSize:'0.9rem'}}>
                  <div><strong>Modulus (q):</strong> {currFrame.ds.q}</div>
                  <div><strong>Base (d):</strong> {currFrame.ds.d}</div>
                  <div style={{padding:'0.5rem', background:'var(--bg-dark-800)', border:'1px solid var(--purple-500)', borderRadius:'0.25rem'}}>
                    <span style={{color:'var(--purple-400)'}}>Pattern Hash:</span> {currFrame.ds.hashP}
                  </div>
                  <div style={{padding:'0.5rem', background:'var(--bg-dark-800)', border:`1px solid ${currFrame.ds.hashP === currFrame.ds.hashT ? 'var(--green-500)' : 'var(--border-gray-600)'}`, borderRadius:'0.25rem'}}>
                    <span style={{color:'var(--cyan-400)'}}>Window Hash:</span> {currFrame.ds.hashT}
                  </div>
                </div>
              )}

              {(!currFrame.ds || Object.keys(currFrame.ds).length === 0) && (
                <div style={{width:'100%', textAlign:'center', color:'var(--text-gray-500)', fontSize:'0.8rem', marginTop:'1rem'}}>
                  Array details will populate upon execution.
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="bottom-layout">
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center', justifyContent: 'space-between'}}>
               <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                 <Code size={14}/> Code Tracker
               </div>
               <select 
                 value={language} 
                 onChange={e => setLanguage(e.target.value)} 
                 style={{ background: 'var(--bg-dark-900)', color: 'var(--cyan-400)', border: '1px solid var(--border-gray-700)', borderRadius: '0.25rem', padding: '0.1rem 0.4rem', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
               >
                 <option value="python">Python</option>
                 <option value="cpp">C++</option>
                 <option value="java">Java</option>
               </select>
             </div>
              <pre className="code-content"><code>
                {ALGO_CODES[activeAlgo][language].map((line, idx) => {
                  const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
                  return (
                    <span key={idx} className={`code-line ${highlightLine === (idx + 1) ? 'highlight' : ''}`} style={isComment ? {color: 'var(--text-gray-500)', fontStyle: 'italic'} : {}}>
                      {line || '\u00A0'}
                    </span>
                  );
                })}
              </code></pre>
          </div>
          
          <div className="panel-box">
             <div className="ds-header" style={{display:'flex', gap:'0.5rem', alignItems:'center'}}><Info size={14}/> Execution Log</div>
             <ul className="log-content">
               {frames.length === 0 && <li className="log-item">Awaiting execution...</li>}
               {frames.slice(0, frameIdx + 1).map((f, idx) => (
                 <li key={idx} className={`log-item ${idx === frameIdx ? 'active' : ''}`}>
                   <span style={{color:'var(--text-gray-500)', marginRight:'0.4rem'}}>[{idx}]</span> {f.logMsg}
                 </li>
               ))}
               <div ref={logEndRef} />
             </ul>
          </div>
        </div>
      </main>
    </div>
  );
}