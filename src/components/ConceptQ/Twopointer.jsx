import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, SkipBack, SkipForward, RotateCcw, Code, AlignLeft, Info, HelpCircle } from 'lucide-react';

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
      
      --water-blue-bg: rgba(59, 130, 246, 0.25);
      --water-blue-border: #60a5fa;
    }

    .visualizer-container { font-family: 'Inter', -apple-system, sans-serif; background-color: var(--bg-dark-900); color: var(--text-gray-200); display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    @media (min-width: 1024px) { .visualizer-container { flex-direction: row; } }

    * { box-sizing: border-box; }

    .controls-sidebar { width: 100%; background-color: var(--bg-dark-800); padding: 1.25rem; border-right: 1px solid var(--border-gray-700); z-index: 10; display: flex; flex-direction: column; overflow-y: auto; }
    @media (min-width: 1024px) { .controls-sidebar { width: 340px; min-width: 340px; height: 100vh; } }

    .sidebar-title { font-size: 1.3rem; font-weight: 800; margin: 0 0 1rem 0; color: var(--cyan-400); display: flex; align-items: center; gap: 0.5rem; }

    .input-group { margin-bottom: 0.75rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-gray-400); text-transform: uppercase; }
    .input-field { width: 100%; padding: 0.5rem 0.75rem; background-color: var(--bg-dark-950); border-radius: 0.375rem; border: 1px solid var(--border-gray-600); color: var(--text-gray-100); font-size: 0.85rem; font-family: monospace; }
    .input-field:focus { outline: none; border-color: var(--cyan-500); }
    .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn { padding: 0.5rem; border-radius: 0.375rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; cursor: pointer; border: none; font-size: 0.8rem; width: 100%; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-cyan { background-color: var(--cyan-600); color: white; border: 1px solid var(--cyan-500); }
    .btn-cyan:hover:not(:disabled) { background-color: var(--cyan-500); }
    .btn-secondary { background-color: var(--bg-dark-700); color: white; border: 1px solid var(--border-gray-600); }
    .btn-secondary:hover:not(:disabled) { background-color: var(--bg-dark-600); }

    .playback-panel { background: var(--bg-dark-950); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--cyan-600); margin-bottom: 1rem; }
    .slider { width: 100%; -webkit-appearance: none; height: 4px; background: var(--bg-dark-700); border-radius: 2px; outline: none; margin: 0.5rem 0; }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--cyan-400); border-radius: 50%; cursor: pointer; }
    .player-controls { display: flex; gap: 0.25rem; margin-top: 0.5rem; }
    .ctrl-btn { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-600); color: var(--text-gray-300); padding: 0.4rem; border-radius: 0.25rem; cursor: pointer; display: flex; justify-content: center; }
    .ctrl-btn:hover:not(:disabled) { background: var(--bg-dark-700); color: var(--cyan-400); border-color: var(--cyan-500); }
    
    .main-content { flex: 1; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; overflow-y: auto; background-color: var(--bg-dark-950); }
    
    .question-panel { background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; padding: 1rem; }
    .question-title { font-size: 1.1rem; font-weight: bold; color: var(--text-gray-100); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
    .question-desc { font-size: 0.85rem; color: var(--text-gray-300); line-height: 1.5; }
    
    .status-bar { padding: 0.75rem 1rem; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
    .status-text { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: var(--cyan-400); }
    
    .var-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.5rem; background: var(--bg-dark-950); border: 1px solid var(--border-gray-600); border-radius: 0.25rem; font-family: monospace; font-size: 0.8rem; }
    .var-badge span { color: var(--purple-400); font-weight: bold; }

    .canvas-wrapper { min-height: 380px; flex: 2; background: var(--bg-dark-900); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; position: relative; overflow-x: auto; overflow-y: hidden; padding: 2rem 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    
    .ds-header { padding: 0.5rem 1rem; background: var(--bg-dark-950); border-bottom: 1px solid var(--border-gray-700); font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: var(--cyan-400); }
    
    .bottom-layout { display: flex; flex-direction: column; gap: 1rem; flex: 1; min-height: 250px; }
    @media (min-width: 1024px) { .bottom-layout { flex-direction: row; } }
    .panel-box { flex: 1; background: var(--bg-dark-800); border: 1px solid var(--border-gray-700); border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .code-content { padding: 1rem; overflow: auto; flex: 1; font-family: 'Fira Code', monospace; font-size: 0.8rem; margin: 0; line-height: 1.5; }
    .code-line { display: block; padding: 0 0.5rem; border-radius: 0.2rem; white-space: pre; }
    .code-line.highlight { background: rgba(6, 182, 212, 0.2); border-left: 3px solid var(--cyan-400); color: white; }
    .log-content { padding: 0.5rem; overflow: auto; flex: 1; font-family: monospace; font-size: 0.8rem; margin: 0; list-style: none; }
    .log-item { padding: 0.4rem; border-bottom: 1px solid var(--border-gray-700); color: var(--text-gray-400); }
    .log-item.active { background: var(--bg-dark-700); color: var(--cyan-400); border-radius: 0.25rem; border-left: 2px solid var(--cyan-400); }

    /* Array Block Visualization */
    .array-container { display: flex; gap: 0.5rem; padding: 2rem 1rem; flex-wrap: wrap; justify-content: center; position: relative; }
    .array-cell-wrapper { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; position: relative; }
    .array-block { width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; background: var(--bg-dark-800); border: 2px solid var(--border-gray-600); border-radius: 0.5rem; font-family: 'Fira Code', monospace; font-size: 1.2rem; font-weight: bold; transition: all 0.2s ease; }
    .array-block.active { border-color: var(--yellow-400); box-shadow: 0 0 10px rgba(250, 204, 21, 0.3); transform: scale(1.05); }
    .array-block.found { border-color: var(--green-400); background: rgba(34, 197, 94, 0.15); color: var(--green-400); }
    .array-block.swapping { border-color: var(--purple-400); background: rgba(168, 85, 247, 0.15); color: var(--purple-300); }
    
    .pointer-badge { padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: bold; position: absolute; z-index: 5; background: var(--bg-dark-700); color: white; border: 1px solid var(--border-gray-500); }
    .pointer-l { background: var(--purple-500); border-color: var(--purple-400); top: -1.8rem; }
    .pointer-r { background: var(--cyan-500); border-color: var(--cyan-400); bottom: -1.8rem; }
  `}</style>
);

const QUESTIONS = {
  containerWater: {
    title: "11. Container With Most Water",
    desc: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store."
  },
  removeDuplicates: {
    title: "26. Remove Duplicates from Sorted Array",
    desc: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums."
  },
  reverseArray: {
    title: "344. Reverse String (Array)",
    desc: "Write a function that reverses a string/array. The input is given as an array of characters/integers. You must do this by modifying the input array in-place with O(1) extra memory."
  },
  pairSum: {
    title: "167. Two Sum II - Input Array Is Sorted",
    desc: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices of the two numbers."
  }
};

const ALGO_CODES = {
  containerWater: {
    python: [
      "def maxArea(height):",
      "    left = 0",
      "    right = len(height) - 1",
      "    max_water = 0",
      "    while left < right:",
      "        width = right - left",
      "        h = min(height[left], height[right])",
      "        curr_area = width * h",
      "        max_water = max(max_water, curr_area)",
      "        if height[left] < height[right]:",
      "            left += 1",
      "        else:",
      "            right -= 1",
      "    return max_water"
    ],
    cpp: [
      "int maxArea(vector<int>& height) {",
      "    int left = 0;",
      "    int right = height.size() - 1;",
      "    int max_water = 0;",
      "    while (left < right) {",
      "        int width = right - left;",
      "        int h = min(height[left], height[right]);",
      "        int curr_area = width * h;",
      "        max_water = max(max_water, curr_area);",
      "        if (height[left] < height[right]) {",
      "            left++;",
      "        } else {",
      "            right--;",
      "        }",
      "    }",
      "    return max_water;",
      "}"
    ],
    java: [
      "class Solution {",
      "    public int maxArea(int[] height) {",
      "        int left = 0;",
      "        int right = height.length - 1;",
      "        int maxWater = 0;",
      "        while (left < right) {",
      "            int width = right - left;",
      "            int h = Math.min(height[left], height[right]);",
      "            int currArea = width * h;",
      "            maxWater = Math.max(maxWater, currArea);",
      "            if (height[left] < height[right]) {",
      "                left++;",
      "            } else {",
      "                right--;",
      "            }",
      "        }",
      "        return maxWater;",
      "    }",
      "}"
    ]
  },
  removeDuplicates: {
    python: [
      "def removeDuplicates(nums):",
      "    if not nums: return 0",
      "    slow = 0",
      "    for fast in range(1, len(nums)):",
      "        if nums[fast] != nums[slow]:",
      "            slow += 1",
      "            nums[slow] = nums[fast]",
      "    return slow + 1"
    ],
    cpp: [
      "int removeDuplicates(vector<int>& nums) {",
      "    if (nums.empty()) return 0;",
      "    int slow = 0;",
      "    for (int fast = 1; fast < nums.size(); fast++) {",
      "        if (nums[fast] != nums[slow]) {",
      "            slow++;",
      "            nums[slow] = nums[fast];",
      "        }",
      "    }",
      "    return slow + 1;",
      "}"
    ],
    java: [
      "class Solution {",
      "    public int removeDuplicates(int[] nums) {",
      "        if (nums.length == 0) return 0;",
      "        int slow = 0;",
      "        for (int fast = 1; fast < nums.length; fast++) {",
      "            if (nums[fast] != nums[slow]) {",
      "                slow++;",
      "                nums[slow] = nums[fast];",
      "            }",
      "        }",
      "        return slow + 1;",
      "    }",
      "}"
    ]
  },
  reverseArray: {
    python: [
      "def reverseString(s):",
      "    left = 0",
      "    right = len(s) - 1",
      "    while left < right:",
      "        temp = s[left]",
      "        s[left] = s[right]",
      "        s[right] = temp",
      "        left += 1",
      "        right -= 1"
    ],
    cpp: [
      "void reverseString(vector<int>& s) {",
      "    int left = 0;",
      "    int right = s.size() - 1;",
      "    while (left < right) {",
      "        int temp = s[left];",
      "        s[left] = s[right];",
      "        s[right] = temp;",
      "        left++;",
      "        right--;",
      "    }",
      "}"
    ],
    java: [
      "class Solution {",
      "    public void reverseString(int[] s) {",
      "        int left = 0;",
      "        int right = s.length - 1;",
      "        while (left < right) {",
      "            int temp = s[left];",
      "            s[left] = s[right];",
      "            s[right] = temp;",
      "            left++;",
      "            right--;",
      "        }",
      "    }",
      "}"
    ]
  },
  pairSum: {
    python: [
      "def twoSum(numbers, target):",
      "    left = 0",
      "    right = len(numbers) - 1",
      "    while left < right:",
      "        curr_sum = numbers[left] + numbers[right]",
      "        if curr_sum == target:",
      "            return [left + 1, right + 1]",
      "        elif curr_sum < target:",
      "            left += 1",
      "        else:",
      "            right -= 1",
      "    return [-1, -1]"
    ],
    cpp: [
      "vector<int> twoSum(vector<int>& numbers, int target) {",
      "    int left = 0;",
      "    int right = numbers.size() - 1;",
      "    while (left < right) {",
      "        int curr_sum = numbers[left] + numbers[right];",
      "        if (curr_sum == target) {",
      "            return {left + 1, right + 1};",
      "        } else if (curr_sum < target) {",
      "            left++;",
      "        } else {",
      "            right--;",
      "        }",
      "    }",
      "    return {-1, -1};",
      "}"
    ],
    java: [
      "class Solution {",
      "    public int[] twoSum(int[] numbers, int target) {",
      "        int left = 0;",
      "        int right = numbers.length - 1;",
      "        while (left < right) {",
      "            int currSum = numbers[left] + numbers[right];",
      "            if (currSum == target) {",
      "                return new int[]{left + 1, right + 1};",
      "            } else if (currSum < target) {",
      "                left++;",
      "            } else {",
      "                right--;",
      "            }",
      "        }",
      "        return new int[]{-1, -1};",
      "    }",
      "}"
    ]
  }
};

const LINE_MAPS = {
  containerWater: {
    python: { init: 4, loop: 5, calcW: 6, calcH: 7, calcArea: 8, updateMax: 9, check: 10, moveL: 11, moveR: 13, ret: 14 },
    cpp: { init: 4, loop: 5, calcW: 6, calcH: 7, calcArea: 8, updateMax: 9, check: 10, moveL: 11, moveR: 13, ret: 16 },
    java: { init: 5, loop: 6, calcW: 7, calcH: 8, calcArea: 9, updateMax: 10, check: 11, moveL: 12, moveR: 14, ret: 17 }
  },
  removeDuplicates: {
    python: { init: 3, loop: 4, check: 5, incrSlow: 6, write: 7, ret: 8 },
    cpp: { init: 3, loop: 4, check: 5, incrSlow: 6, write: 7, ret: 10 },
    java: { init: 4, loop: 5, check: 6, incrSlow: 7, write: 8, ret: 11 }
  },
  reverseArray: {
    python: { init: 3, loop: 4, temp: 5, swap1: 6, swap2: 7, moveL: 8, moveR: 9 },
    cpp: { init: 3, loop: 4, temp: 5, swap1: 6, swap2: 7, moveL: 8, moveR: 9 },
    java: { init: 4, loop: 5, temp: 6, swap1: 7, swap2: 8, moveL: 9, moveR: 10 }
  },
  pairSum: {
    python: { init: 3, loop: 4, sum: 5, checkMatch: 6, retFound: 7, checkLess: 8, moveL: 9, moveR: 11, retNotFound: 12 },
    cpp: { init: 3, loop: 4, sum: 5, checkMatch: 6, retFound: 7, checkLess: 8, moveL: 9, moveR: 11, retNotFound: 14 },
    java: { init: 4, loop: 5, sum: 6, checkMatch: 7, retFound: 8, checkLess: 9, moveL: 10, moveR: 12, retNotFound: 15 }
  }
};

const DEFAULTS = {
  containerWater: { input: "1,8,6,2,5,4,8,3,7", target: "" },
  removeDuplicates: { input: "0,0,1,1,1,2,2,3,3,4", target: "" },
  reverseArray: { input: "1,2,3,4,5,6", target: "" },
  pairSum: { input: "2,7,11,15", target: "9" }
};

const parseArray = (str) => str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

export default function TwoPointerVisualizer() {
  const [activeAlgo, setActiveAlgo] = useState("containerWater");
  const [arrayInput, setArrayInput] = useState(DEFAULTS.containerWater.input);
  const [targetInput, setTargetInput] = useState(DEFAULTS.containerWater.target);
  const [language, setLanguage] = useState("java");
  
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  
  const logEndRef = useRef(null);

  // Auto-update default inputs when algorithm changes
  useEffect(() => {
    setArrayInput(DEFAULTS[activeAlgo].input);
    setTargetInput(DEFAULTS[activeAlgo].target);
    resetSim();
  }, [activeAlgo]);

  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0 && frameIdx < frames.length - 1) {
      timer = setTimeout(() => setFrameIdx(p => p + 1), speed);
    } else if (frameIdx >= frames.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIdx, frames, speed]);

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [frameIdx]);

  const resetSim = () => { setFrames([]); setFrameIdx(-1); setIsPlaying(false); };

  const generateContainerWaterFrames = (arr) => {
    const f = [];
    let L = 0, R = arr.length - 1;
    let maxArea = 0;
    f.push({ logMsg: `Init: L=0, R=${R}, maxArea=0`, lineKey: 'init', vars: { L, R, maxArea }, ds: { arr: [...arr] } });

    while (L < R) {
      f.push({ logMsg: `While L < R (${L} < ${R})`, lineKey: 'loop', vars: { L, R, maxArea }, ds: { arr: [...arr] } });
      const w = R - L;
      f.push({ logMsg: `Calculate width: ${R} - ${L} = ${w}`, lineKey: 'calcW', vars: { L, R, maxArea, w }, ds: { arr: [...arr] } });
      const h = Math.min(arr[L], arr[R]);
      f.push({ logMsg: `Calculate height: min(${arr[L]}, ${arr[R]}) = ${h}`, lineKey: 'calcH', vars: { L, R, maxArea, w, h }, ds: { arr: [...arr] } });
      const currArea = w * h;
      f.push({ logMsg: `Current Area: ${w} * ${h} = ${currArea}`, lineKey: 'calcArea', vars: { L, R, maxArea, w, h, currArea }, ds: { arr: [...arr] } });
      
      if (currArea > maxArea) {
        maxArea = currArea;
        f.push({ logMsg: `Update maxArea to ${maxArea}`, lineKey: 'updateMax', vars: { L, R, maxArea, w, h, currArea }, ds: { arr: [...arr] }, updateHighlight: true });
      } else {
        f.push({ logMsg: `maxArea remains ${maxArea}`, lineKey: 'updateMax', vars: { L, R, maxArea, w, h, currArea }, ds: { arr: [...arr] } });
      }

      f.push({ logMsg: `Check heights: arr[L] (${arr[L]}) < arr[R] (${arr[R]})?`, lineKey: 'check', vars: { L, R, maxArea, w, h, currArea }, ds: { arr: [...arr] } });
      if (arr[L] < arr[R]) {
        f.push({ logMsg: `arr[L] is smaller, moving L pointer right`, lineKey: 'moveL', vars: { L: L+1, R, maxArea }, ds: { arr: [...arr] } });
        L++;
      } else {
        f.push({ logMsg: `arr[R] is smaller or equal, moving R pointer left`, lineKey: 'moveR', vars: { L, R: R-1, maxArea }, ds: { arr: [...arr] } });
        R--;
      }
    }
    f.push({ logMsg: `Pointers crossed. Return maxArea: ${maxArea}`, lineKey: 'ret', vars: { maxArea }, ds: { arr: [...arr] }, done: true });
    return f;
  };

  const generateRemoveDuplicatesFrames = (arr) => {
    const f = [];
    if (arr.length === 0) return f;
    let slow = 0;
    f.push({ logMsg: `Init: slow=0`, lineKey: 'init', vars: { slow, fast: 1 }, ds: { arr: [...arr] } });
    
    for (let fast = 1; fast < arr.length; fast++) {
      f.push({ logMsg: `Loop: fast=${fast}`, lineKey: 'loop', vars: { slow, fast }, ds: { arr: [...arr] } });
      f.push({ logMsg: `Check: arr[fast] (${arr[fast]}) != arr[slow] (${arr[slow]})?`, lineKey: 'check', vars: { slow, fast }, ds: { arr: [...arr] } });
      
      if (arr[fast] !== arr[slow]) {
        slow++;
        f.push({ logMsg: `Not equal! Increment slow to ${slow}`, lineKey: 'incrSlow', vars: { slow, fast }, ds: { arr: [...arr] } });
        arr[slow] = arr[fast];
        f.push({ logMsg: `Write arr[fast] (${arr[fast]}) to arr[slow]`, lineKey: 'write', vars: { slow, fast }, ds: { arr: [...arr] }, actionIndex: slow });
      } else {
        f.push({ logMsg: `Equal. Continue fast pointer.`, lineKey: 'check', vars: { slow, fast }, ds: { arr: [...arr] } });
      }
    }
    f.push({ logMsg: `Return length: ${slow + 1}`, lineKey: 'ret', vars: { slow }, ds: { arr: [...arr] }, done: true });
    return f;
  };

  const generateReverseArrayFrames = (arr) => {
    const f = [];
    let L = 0, R = arr.length - 1;
    f.push({ logMsg: `Init: L=0, R=${R}`, lineKey: 'init', vars: { L, R }, ds: { arr: [...arr] } });
    
    while (L < R) {
      f.push({ logMsg: `While L < R (${L} < ${R})`, lineKey: 'loop', vars: { L, R }, ds: { arr: [...arr] } });
      f.push({ logMsg: `Temp = arr[L] (${arr[L]})`, lineKey: 'temp', vars: { L, R, temp: arr[L] }, ds: { arr: [...arr] } });
      
      let temp = arr[L];
      arr[L] = arr[R];
      f.push({ logMsg: `arr[L] = arr[R] (${arr[R]})`, lineKey: 'swap1', vars: { L, R, temp }, ds: { arr: [...arr] }, actionIndex: L });
      
      arr[R] = temp;
      f.push({ logMsg: `arr[R] = Temp (${temp})`, lineKey: 'swap2', vars: { L, R, temp }, ds: { arr: [...arr] }, actionIndex: R });
      
      f.push({ logMsg: `Move L right`, lineKey: 'moveL', vars: { L: L+1, R, temp }, ds: { arr: [...arr] } });
      L++;
      f.push({ logMsg: `Move R left`, lineKey: 'moveR', vars: { L, R: R-1, temp }, ds: { arr: [...arr] } });
      R--;
    }
    f.push({ logMsg: `Reverse complete.`, lineKey: null, vars: {}, ds: { arr: [...arr] }, done: true });
    return f;
  };

  const generatePairSumFrames = (arr, target) => {
    const f = [];
    let L = 0, R = arr.length - 1;
    f.push({ logMsg: `Init: L=0, R=${R}, Target=${target}`, lineKey: 'init', vars: { L, R, target }, ds: { arr: [...arr] } });
    
    while (L < R) {
      f.push({ logMsg: `While L < R (${L} < ${R})`, lineKey: 'loop', vars: { L, R, target }, ds: { arr: [...arr] } });
      const sum = arr[L] + arr[R];
      f.push({ logMsg: `Sum = arr[L] + arr[R] = ${arr[L]} + ${arr[R]} = ${sum}`, lineKey: 'sum', vars: { L, R, target, sum }, ds: { arr: [...arr] } });
      
      f.push({ logMsg: `Check if sum == target (${sum} == ${target})`, lineKey: 'checkMatch', vars: { L, R, target, sum }, ds: { arr: [...arr] } });
      if (sum === target) {
        f.push({ logMsg: `Target found at indices ${L} and ${R}!`, lineKey: 'retFound', vars: { L, R, target, sum }, ds: { arr: [...arr] }, done: true, foundIndices: [L, R] });
        return f;
      }
      
      f.push({ logMsg: `Check if sum < target (${sum} < ${target})`, lineKey: 'checkLess', vars: { L, R, target, sum }, ds: { arr: [...arr] } });
      if (sum < target) {
        f.push({ logMsg: `Sum is less, need larger values. Move L right.`, lineKey: 'moveL', vars: { L: L+1, R, target, sum }, ds: { arr: [...arr] } });
        L++;
      } else {
        f.push({ logMsg: `Sum is greater, need smaller values. Move R left.`, lineKey: 'moveR', vars: { L, R: R-1, target, sum }, ds: { arr: [...arr] } });
        R--;
      }
    }
    f.push({ logMsg: `Target not found in array.`, lineKey: 'retNotFound', vars: { target }, ds: { arr: [...arr] }, done: true });
    return f;
  };

  const executeAlgorithm = () => {
    resetSim();
    const arr = parseArray(arrayInput);
    if (arr.length === 0) return;
    
    let newFrames = [];
    if (activeAlgo === 'containerWater') newFrames = generateContainerWaterFrames(arr);
    if (activeAlgo === 'removeDuplicates') newFrames = generateRemoveDuplicatesFrames(arr);
    if (activeAlgo === 'reverseArray') newFrames = generateReverseArrayFrames(arr);
    if (activeAlgo === 'pairSum') {
      const target = parseInt(targetInput);
      if (isNaN(target)) return;
      newFrames = generatePairSumFrames(arr, target);
    }
    
    setFrames(newFrames); setFrameIdx(0); setIsPlaying(true);
  };

  const currFrame = frames[frameIdx] || { logMsg: 'Ready. Compile & Run to visualize.', lineKey: null, vars: {}, ds: { arr: parseArray(arrayInput) } };
  const highlightLine = currFrame.lineKey ? LINE_MAPS[activeAlgo][language][currFrame.lineKey] : -1;
  const isLocked = frames.length > 0;
  
  // Renderers
  const renderContainerWater = () => {
    const arr = currFrame.ds.arr;
    if (!arr || arr.length === 0) return null;
    
    const maxVal = Math.max(...arr, 1); // Avoid division by zero
    const L = currFrame.vars.L;
    const R = currFrame.vars.R;
    const isActiveFrame = L !== undefined && R !== undefined && L < R && !currFrame.done;
    
    const barWidth = 60;
    const gap = 16;
    
    // Water Box Calculations
    let waterBoxLeft = 0;
    let waterBoxWidth = 0;
    let waterBoxHeight = 0;
    let currAreaText = "";
    
    if (isActiveFrame) {
      // Simplified positional math since padding is moved out
      waterBoxLeft = L * (barWidth + gap);
      waterBoxWidth = (R - L) * (barWidth + gap) + barWidth;
      const minH = Math.min(arr[L], arr[R]);
      waterBoxHeight = (minH / maxVal) * 100;
      currAreaText = currFrame.vars.currArea !== undefined ? currFrame.vars.currArea : "";
    }

    return (
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Strict container for graph content to perfectly align bottom bounds */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: `${gap}px`, height: '240px', position: 'relative', minWidth: 'max-content' }}>
          
          {/* Water Bounding Box (Background - behind bars) */}
          {isActiveFrame && waterBoxHeight > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '0', /* Aligns perfectly with the bottom of the bars */
              left: `${waterBoxLeft}px`,
              width: `${waterBoxWidth}px`,
              height: `${waterBoxHeight}%`,
              border: `2px dashed var(--water-blue-border)`,
              borderBottom: 'none',
              backgroundColor: 'var(--water-blue-bg)',
              zIndex: 5,
              transition: 'all 0.3s ease'
            }}/>
          )}

          {/* Area Text (Foreground - in front of bars) */}
          {isActiveFrame && waterBoxHeight > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: `${waterBoxLeft}px`,
              width: `${waterBoxWidth}px`,
              height: `${waterBoxHeight}%`,
              zIndex: 20, /* Highest z-index ensures text pops over everything */
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)'
              }}>{currAreaText}</span>
            </div>
          )}

          {/* Bars */}
          {arr.map((val, idx) => {
            const isL = idx === L;
            const isR = idx === R;
            const heightPct = (val / maxVal) * 100;
            
            return (
              <div key={idx} style={{ 
                position: 'relative',
                width: `${barWidth}px`,
                height: `${heightPct}%`,
                backgroundColor: isL ? 'var(--purple-500)' : isR ? 'var(--cyan-500)' : 'var(--bg-dark-700)',
                borderRadius: '4px 4px 0 0',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '8px',
                color: 'white',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: (isL || isR) ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
                zIndex: 10 /* Bars are above water background but below water text */
              }}>
                {isL && <div className="pointer-badge" style={{ background: 'var(--purple-500)', borderColor: 'var(--purple-400)', top: '-30px' }}>L</div>}
                
                <span>{val}</span>
                
                {/* Labels repositioned to absolute positions outside the bar boundaries */}
                <div style={{ position: 'absolute', bottom: '-22px', color: 'var(--text-gray-500)', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 'normal' }}>
                  {idx}
                </div>
                
                {isR && <div className="pointer-badge" style={{ background: 'var(--cyan-500)', borderColor: 'var(--cyan-400)', bottom: '-45px' }}>R</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStandardArray = () => {
    const arr = currFrame.ds.arr;
    if (!arr) return null;

    return (
      <div className="array-container">
        {arr.map((val, idx) => {
          let pointers = [];
          if (activeAlgo === 'removeDuplicates') {
            if (currFrame.vars.slow === idx) pointers.push({ label: 'S', pos: 'bottom', color: 'purple' });
            if (currFrame.vars.fast === idx) pointers.push({ label: 'F', pos: 'top', color: 'cyan' });
          } else if (activeAlgo === 'reverseArray' || activeAlgo === 'pairSum') {
            if (currFrame.vars.L === idx) pointers.push({ label: 'L', pos: 'bottom', color: 'purple' });
            if (currFrame.vars.R === idx) pointers.push({ label: 'R', pos: 'top', color: 'cyan' });
          }

          let blockClass = "array-block";
          if (currFrame.actionIndex === idx) blockClass += " swapping";
          if (currFrame.foundIndices && currFrame.foundIndices.includes(idx)) blockClass += " found";

          return (
            <div key={idx} className="array-cell-wrapper">
              {pointers.filter(p => p.pos === 'top').map((p, i) => (
                <div key={i} className={`pointer-badge`} style={{ top: '-1.5rem', backgroundColor: `var(--${p.color}-500)`, borderColor: `var(--${p.color}-400)` }}>{p.label}</div>
              ))}
              
              <div className={blockClass}>{val}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-gray-500)' }}>{idx}</div>
              
              {pointers.filter(p => p.pos === 'bottom').map((p, i) => (
                <div key={i} className={`pointer-badge`} style={{ bottom: '-1.5rem', backgroundColor: `var(--${p.color}-500)`, borderColor: `var(--${p.color}-400)` }}>{p.label}</div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="visualizer-container">
      <InjectedStyles />
      
      <aside className="controls-sidebar">
        <h1 className="sidebar-title"><HelpCircle size={24} /> Two Pointers</h1>
        
        <div className="playback-panel">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button onClick={executeAlgorithm} className="btn btn-cyan" disabled={isLocked || !arrayInput}>
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
            <label style={{fontSize:'0.65rem', color:'var(--cyan-400)', display:'flex', justifyContent:'space-between'}}><span>Speed</span> <span>{speed}ms</span></label>
            <input type="range" min="100" max="1500" step="100" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="slider" style={{margin:0}} />
          </div>
        </div>

        <div className="input-group">
          <label>Algorithm</label>
          <select value={activeAlgo} onChange={e => setActiveAlgo(e.target.value)} className="input-field">
            <option value="containerWater">Container With Most Water</option>
            <option value="removeDuplicates">Remove Duplicates</option>
            <option value="reverseArray">Reverse Array</option>
            <option value="pairSum">Two Sum II (Pair Sum)</option>
          </select>
        </div>

        <div className="input-group">
          <label>Input Array (comma separated)</label>
          <input type="text" value={arrayInput} onChange={e => { setArrayInput(e.target.value); resetSim(); }} className="input-field" placeholder="e.g. 1,8,6,2,5,4,8,3,7" />
        </div>
        
        {activeAlgo === 'pairSum' && (
          <div className="input-group">
            <label>Target Sum</label>
            <input type="number" value={targetInput} onChange={e => { setTargetInput(e.target.value); resetSim(); }} className="input-field" placeholder="e.g. 9" />
          </div>
        )}
      </aside>

      <main className="main-content">
        {/* LeetCode Question Panel */}
        <div className="question-panel">
          <div className="question-title">{QUESTIONS[activeAlgo].title}</div>
          <div className="question-desc">{QUESTIONS[activeAlgo].desc}</div>
        </div>

        <div className="status-bar">
          <span className="status-text">&gt; {currFrame.logMsg}</span>
          <div style={{display:'flex', gap:'0.25rem', flexWrap:'wrap'}}>
            {currFrame.vars && Object.entries(currFrame.vars).map(([k,v]) => {
              if (v === undefined || v === null) return null;
              return <div key={k} className="var-badge"><span>{k}:</span>{v}</div>
            })}
          </div>
        </div>

        {/* Dynamic Canvas */}
        <div className="canvas-wrapper">
          <div style={{position:'absolute', top:'0.5rem', left:'0.5rem', fontSize:'0.75rem', color:'var(--text-gray-400)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'0.5rem'}}><AlignLeft size={14}/> VISUALIZATION</div>
          {activeAlgo === 'containerWater' ? renderContainerWater() : renderStandardArray()}
        </div>

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
                 <option value="java">Java</option>
                 <option value="python">Python</option>
                 <option value="cpp">C++</option>
               </select>
             </div>
              <pre className="code-content"><code>
                {ALGO_CODES[activeAlgo][language].map((line, idx) => {
                  return (
                    <span key={idx} className={`code-line ${highlightLine === (idx + 1) ? 'highlight' : ''}`}>
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