import { Fragment, type ReactNode } from 'react';

/**
 * Deliberately tiny syntax highlighter (keywords, strings, comments, annotations, numbers)
 * so the playground does not ship a full highlighting library.
 */
const RULES: Array<[RegExp, string]> = [
  [/^(\/\/.*|--.*|#.*)/, 'text-slate-500 italic'],
  [/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, 'text-amber-200'],
  [/^@\w+/, 'text-fuchsia-300'],
  [
    /^\b(public|private|protected|final|static|class|interface|record|extends|implements|return|new|if|else|throw|try|catch|import|export|const|let|function|async|await|void|null|true|false|this|CREATE|TABLE|PRIMARY|KEY|REFERENCES|NOT|NULL|DEFAULT|UNIQUE|INDEX|ON|DELETE|CASCADE|CHECK|IN|AND|type|from|as)\b/,
    'text-violet-300',
  ],
  [/^\b(String|UUID|List|Optional|boolean|int|long|VARCHAR|UUID|TEXT|JSONB|BOOLEAN|INTEGER|TIMESTAMPTZ|Promise)\b/, 'text-cyan-300'],
  [/^\b\d+\b/, 'text-emerald-300'],
];

export function highlight(code: string): ReactNode {
  const out: ReactNode[] = [];
  let rest = code;
  let plain = '';
  let key = 0;
  const flush = () => {
    if (plain) {
      out.push(<Fragment key={key++}>{plain}</Fragment>);
      plain = '';
    }
  };
  while (rest.length > 0) {
    let matched = false;
    // Only try token rules at a word/line boundary to keep it predictable.
    for (const [re, cls] of RULES) {
      const m = rest.match(re);
      if (m && m.index === 0 && m[0].length > 0) {
        const prev = plain.slice(-1);
        if (/\w/.test(prev) && /^\w/.test(m[0])) continue;
        flush();
        out.push(
          <span key={key++} className={cls}>
            {m[0]}
          </span>,
        );
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      plain += rest[0];
      rest = rest.slice(1);
    }
  }
  flush();
  return out;
}
