export default function ReservationList({ data, onRowClick }) {
    return (
        <div className="bg-card-bg border border-border-subtle rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <table className="w-full text-left border-collapse">
                <thead className="bg-app-bg/50 text-[10px] font-black tracking-widest text-text-muted uppercase border-b border-border-subtle">
                    <tr>
                        <th className="p-5">Booking ID</th>
                        <th className="p-5">Guest Name</th>
                        <th className="p-5">Check-in</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Source</th>
                    </tr>
                </thead>
                <tbody className="text-sm font-medium">
                    {data.map((res) => (
                        <tr
                            key={res.id}
                            onClick={() => onRowClick(res)}
                            className="border-b border-border-subtle/50 hover:bg-brand/5 cursor-pointer transition-all group"
                        >
                            <td className="p-5 font-bold text-brand">
                                {res.id}
                            </td>
                            <td className="p-5 text-text-main font-bold">
                                {res.guest}
                            </td>
                            <td className="p-5 text-text-secondary">
                                {res.checkin}
                            </td>
                            <td className="p-5">
                                <span
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase
                                    ${res.status === "Checked-in" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"}`}
                                >
                                    {res.status}
                                </span>
                            </td>
                            <td className="p-5 text-text-muted italic">
                                {res.source}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
