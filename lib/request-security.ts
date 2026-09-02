import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function rejectCrossSiteRequest() {
    const requestHeaders = await headers();
    const origin = requestHeaders.get("origin");
    const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") || "http";
    const secFetchSite = requestHeaders.get("sec-fetch-site");

    if (origin && host && origin !== `${protocol}://${host}`) {
        return NextResponse.json({ error: "Blocked cross-origin request." }, { status: 403 });
    }

    if (secFetchSite === "cross-site") {
        return NextResponse.json({ error: "Blocked cross-site request." }, { status: 403 });
    }

    return null;
}
