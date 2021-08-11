const cot = require('../src/cot.js')

test('Decode COT message', () => {
	const packet = '<event version="2.0" uid="ANDROID-deadbeef" type="a-f-G-U-C" how="m-g" time="2021-02-27T20:32:24.771Z" start="2021-02-27T20:32:24.771Z" stale="2021-02-27T20:38:39.771Z"><point lat="1.234567" lon="-3.141592" hae="-25.7" ce="9.9" le="9999999.0"/><detail><takv os="29" version="4.0.0.0 (deadbeef).1234567890-CIV" device="Some Android Device" platform="ATAK-CIV"/><contact xmppUsername="xmpp@host.com" endpoint="*:-1:stcp" callsign="JENNY"/><uid Droid="JENNY"/><precisionlocation altsrc="GPS" geopointsrc="GPS"/><__group role="Team Member" name="Cyan"/><status battery="78"/><track course="80.24833892285461" speed="0.0"/></detail></event>'

	expect(cot.xml2js(packet)).toStrictEqual({
		"event": {
			"_attributes": {
				"version": "2.0",
				"uid": "ANDROID-deadbeef",
				"type": "a-f-G-U-C",
				"how": "m-g",
				"time": "2021-02-27T20:32:24.771Z",
				"start": "2021-02-27T20:32:24.771Z",
				"stale": "2021-02-27T20:38:39.771Z"
			},
			"point": {
				"_attributes": {
					"lat": "1.234567",
					"lon": "-3.141592",
					"hae": "-25.7",
					"ce": "9.9",
					"le": "9999999.0"
				}
			},
			"detail": {
				"takv": {
					"_attributes": {
						"os": "29",
						"version": "4.0.0.0 (deadbeef).1234567890-CIV",
						"device": "Some Android Device",
						"platform": "ATAK-CIV"
					}
				},
				"contact": {
					"_attributes": {
						"xmppUsername": "xmpp@host.com",
						"endpoint": "*:-1:stcp",
						"callsign": "JENNY"
					}
				},
				"uid": {"_attributes": {"Droid": "JENNY"}},
				"precisionlocation": {"_attributes": {"altsrc": "GPS", "geopointsrc": "GPS"}},
				"__group": {"_attributes": {"role": "Team Member", "name": "Cyan"}},
				"status": {"_attributes": {"battery": "78"}},
				"track": {"_attributes": {"course": "80.24833892285461", "speed": "0.0"}}
			}
		}
	})
})

test('Decode COT message', () => {
	const packet = '<event version="2.0" uid="TEST-deadbeef" type="a" how="m-g" time="2021-03-12T15:49:07.138Z" start="2021-03-12T15:49:07.138Z" stale="2021-03-12T15:49:07.138Z"><point lat="0.000000" lon="0.000000" hae="0.0" ce="9999999.0" le="9999999.0"/><detail><takv os="Android" version="10" device="Some Device" platform="python unittest"/><status battery="83"/><uid Droid="JENNY"/><contact callsign="JENNY" endpoint="*:-1:stcp" phone="800-867-5309"/><__group role="Team Member" name="Cyan"/><track course="90.1" speed="10.3"/></detail></event>'

	expect(cot.xml2js(packet)).toStrictEqual({
			"event": {
				"_attributes": {
					"version": "2.0",
					"uid": "TEST-deadbeef",
					"type": "a",
					"how": "m-g",
					"time": "2021-03-12T15:49:07.138Z",
					"start": "2021-03-12T15:49:07.138Z",
					"stale": "2021-03-12T15:49:07.138Z"
				},
				"point": {
					"_attributes": {
						"lat": "0.000000",
						"lon": "0.000000",
						"hae": "0.0",
						"ce": "9999999.0",
						"le": "9999999.0"
					}
				},
				"detail": {
					"takv": {
						"_attributes": {
							"os": "Android",
							"version": "10",
							"device": "Some Device",
							"platform": "python unittest"
						}
					},
					"status": {
						"_attributes": {
							"battery": "83"
						}
					},
					"uid": {
						"_attributes": {
							"Droid": "JENNY"
						}
					},
					"contact": {
						"_attributes": {
							"callsign": "JENNY",
							"endpoint": "*:-1:stcp",
							"phone": "800-867-5309"
						}
					},
					"__group": {
						"_attributes": {
							"role": "Team Member",
							"name": "Cyan"
						}
					},
					"track": {
						"_attributes": {
							"course": "90.1",
							"speed": "10.3"
						}
					}
				}
			}
		}
	)
})

test('Encode COT message', () => {
	const packet = {
		"event": {
			"_attributes": {
				"version": "2.0",
				"uid": "ANDROID-deadbeef",
				"type": "a-f-G-U-C",
				"how": "m-g",
				"time": "2021-02-27T20:32:24.771Z",
				"start": "2021-02-27T20:32:24.771Z",
				"stale": "2021-02-27T20:38:39.771Z"
			},
			"point": {
				"_attributes": {
					"lat": "1.234567",
					"lon": "-3.141592",
					"hae": "-25.7",
					"ce": "9.9",
					"le": "9999999.0"
				}
			},
			"detail": {
				"takv": {
					"_attributes": {
						"os": "29",
						"version": "4.0.0.0 (deadbeef).1234567890-CIV",
						"device": "Some Android Device",
						"platform": "ATAK-CIV"
					}
				},
				"contact": {
					"_attributes": {
						"xmppUsername": "xmpp@host.com",
						"endpoint": "*:-1:stcp",
						"callsign": "JENNY"
					}
				},
				"uid": {"_attributes": {"Droid": "JENNY"}},
				"precisionlocation": {"_attributes": {"altsrc": "GPS", "geopointsrc": "GPS"}},
				"__group": {"_attributes": {"role": "Team Member", "name": "Cyan"}},
				"status": {"_attributes": {"battery": "78"}},
				"track": {"_attributes": {"course": "80.24833892285461", "speed": "0.0"}}
			}
		}
	}

	expect(cot.js2xml(packet)).toStrictEqual('<event version="2.0" uid="ANDROID-deadbeef" type="a-f-G-U-C" how="m-g" time="2021-02-27T20:32:24.771Z" start="2021-02-27T20:32:24.771Z" stale="2021-02-27T20:38:39.771Z"><point lat="1.234567" lon="-3.141592" hae="-25.7" ce="9.9" le="9999999.0"/><detail><takv os="29" version="4.0.0.0 (deadbeef).1234567890-CIV" device="Some Android Device" platform="ATAK-CIV"/><contact xmppUsername="xmpp@host.com" endpoint="*:-1:stcp" callsign="JENNY"/><uid Droid="JENNY"/><precisionlocation altsrc="GPS" geopointsrc="GPS"/><__group role="Team Member" name="Cyan"/><status battery="78"/><track course="80.24833892285461" speed="0.0"/></detail></event>')
})

test('Parse GeoChat message', () => {
	const geochat = '<event version="2.0" uid="GeoChat.ANDROID-deadbeef.JOKER MAN.563040b9-2ac9-4af3-9e01-4cb2b05d98ea" type="b-t-f" how="h-g-i-g-o" time="2021-02-23T22:28:22.191Z" start="2021-02-23T22:28:22.191Z" stale="2021-02-24T22:28:22.191Z">\n' +
		'  <point lat="1.234567" lon="-3.141592" hae="-25.8" ce="9.9" le="9999999.0"/>\n' +
		'  <detail>\n' +
		'    <__chat parent="RootContactGroup" groupOwner="false" chatroom="JOKER MAN" id="ANDROID-cafebabe" senderCallsign="JENNY">\n' +
		'      <chatgrp uid0="ANDROID-deadbeef" uid1="ANDROID-cafebabe" id="ANDROID-cafebabe"/>\n' +
		'    </__chat>\n' +
		'    <link uid="ANDROID-deadbeef" type="a-f-G-U-C" relation="p-p"/>\n' +
		'    <remarks source="BAO.F.ATAK.ANDROID-deadbeef" to="ANDROID-cafebabe" time="2021-02-23T22:28:22.191Z">test</remarks>\n' +
		'    <__serverdestination destinations="123.45.67.89:4242:tcp:ANDROID-deadbeef"/>\n' +
		'    <marti>\n' +
		'      <dest callsign="JOKER MAN"/>\n' +
		'    </marti>\n' +
		'  </detail>\n' +
		'</event>'

	expect(cot.xml2js(geochat)).toStrictEqual({
			"event": {
				"_attributes": {
					"version": "2.0",
					"uid": "GeoChat.ANDROID-deadbeef.JOKER MAN.563040b9-2ac9-4af3-9e01-4cb2b05d98ea",
					"type": "b-t-f",
					"how": "h-g-i-g-o",
					"time": "2021-02-23T22:28:22.191Z",
					"start": "2021-02-23T22:28:22.191Z",
					"stale": "2021-02-24T22:28:22.191Z"
				},
				"point": {
					"_attributes": {
						"lat": "1.234567",
						"lon": "-3.141592",
						"hae": "-25.8",
						"ce": "9.9",
						"le": "9999999.0"
					}
				},
				"detail": {
					"__chat": {
						"_attributes": {
							"parent": "RootContactGroup",
							"groupOwner": "false",
							"chatroom": "JOKER MAN",
							"id": "ANDROID-cafebabe",
							"senderCallsign": "JENNY"
						},
						"chatgrp": {
							"_attributes": {
								"uid0": "ANDROID-deadbeef",
								"uid1": "ANDROID-cafebabe",
								"id": "ANDROID-cafebabe"
							}
						}
					},
					"link": {"_attributes": {"uid": "ANDROID-deadbeef", "type": "a-f-G-U-C", "relation": "p-p"}},
					"remarks": {
						"_attributes": {
							"source": "BAO.F.ATAK.ANDROID-deadbeef",
							"to": "ANDROID-cafebabe",
							"time": "2021-02-23T22:28:22.191Z"
						}, "_text": "test"
					},
					"__serverdestination": {"_attributes": {"destinations": "123.45.67.89:4242:tcp:ANDROID-deadbeef"}},
					"marti": {"dest": {"_attributes": {"callsign": "JOKER MAN"}}}
				}
			}
		}
	)
})