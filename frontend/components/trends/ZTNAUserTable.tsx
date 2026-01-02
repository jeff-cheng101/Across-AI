interface ZTNAUser {
  name: string;
  loginCount: number;
  previousLoginCount: number;
  change: number;
}

interface ZTNAUserTableProps {
  users: ZTNAUser[];
}

export function ZTNAUserTable({ users }: ZTNAUserTableProps) {
  return (
    <div className="card-dark rounded-xl p-5 border border-slate-700/50">
      <h3 className="text-white text-base mb-4">Top 使用者</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">
                排名
              </th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">
                使用者
              </th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">
                登入次數
              </th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">
                變化率
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const rank = index + 1;
              return (
                <tr
                  key={user.name}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-semibold">
                        {rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-200 font-mono text-xs">
                    {user.name ?? 'N/A'}
                  </td>
                  <td className="py-3 px-2 text-white">
                    {(user.loginCount ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`${
                        (user.change ?? 0) > 0
                          ? 'text-red-400'
                          : (user.change ?? 0) < 0
                            ? 'text-green-400'
                            : 'text-slate-400'
                      }`}
                    >
                      {(user.change ?? 0) > 0 ? '+' : ''}
                      {(user.change ?? 0).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
