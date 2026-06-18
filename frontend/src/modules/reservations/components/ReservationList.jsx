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
                                {res.id.split('-')[0].toUpperCase()}
                            </td>
                            <td className="p-5 text-text-main font-bold">
                                {res.guest_name || res.guest || 'Unknown Guest'}
                            </td>
                            <td className="p-5 text-text-secondary">
                                {new Date(res.check_in_date || res.checkin).toLocaleDateString()}
                            </td>
                            <td className="p-5">
                                {(() => {
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    const checkOutDate = new Date(res.check_out_date || res.checkout);
                                    checkOutDate.setHours(0,0,0,0);
                                    const isDueOut = res.status === "CHECKED_IN" && checkOutDate <= today;

                                    let badgeClass = "bg-blue-500/10 text-blue-500";
                                    let displayStatus = res.status;

                                    if (isDueOut) {
                                        badgeClass = "bg-orange-500/10 text-orange-500";
                                        displayStatus = "DUE OUT";
                                    } else if (res.status === "CHECKED_IN") {
                                        badgeClass = "bg-green-500/10 text-green-500";
                                    } else if (res.status === "CHECKED_OUT") {
                                        badgeClass = "bg-gray-500/10 text-gray-500";
                                    } else if (res.status === "CANCELLED") {
                                        badgeClass = "bg-red-500/10 text-red-500";
                                    }

                                    return (
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${badgeClass}`}>
                                            {displayStatus}
                                        </span>
                                    );
                                })()}
                            </td>
                            <td className="p-5 text-text-muted italic">
                                {res.source}
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-10 text-center text-text-muted font-bold">No reservations found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
