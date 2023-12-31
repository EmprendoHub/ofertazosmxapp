import dbConnect from "@/lib/db";
import Address from "@/backend/models/Address";

export async function POST(req) {
  const sessionData = req.headers.get("x-mysession-key");
  const session = JSON.parse(sessionData);

  if (session) {
    try {
      await dbConnect();
      const inAddress = await req.json();
      const { street, city, province, zipcode, country, phone, user } =
        await inAddress.address;
      let zip_code = zipcode;
      const newAddress = await Address.create({
        street,
        city,
        province,
        zip_code,
        country,
        phone,
        user,
      });
      //._doc is getting the values of the Address
      const { ...address } = newAddress._doc;

      return new Response(JSON.stringify(address), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify(error.message), { status: 500 });
    }
  } else {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
}

export async function PUT(req) {
  const sessionData = req.headers.get("x-mysession-key");
  const session = JSON.parse(sessionData);
  if (session) {
    try {
      await dbConnect();
      const inAddress = await req.json();

      const {
        address_id,
        street,
        city,
        province,
        zipcode,
        country,
        phone,
        user,
      } = await inAddress.address;

      const updateAddress = await Address.findByIdAndUpdate(address_id, {
        street: street,
        city: city,
        province: province,
        zip_code: zipcode,
        country: country,
        phone: phone,
        user: user,
      });
      //._doc is getting the values of the Address
      const { ...address } = updateAddress._doc;

      return new Response(JSON.stringify(address), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify(error.message), { status: 500 });
    }
  } else {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
}

export async function DELETE(req) {
  const sessionData = req.headers.get("x-mysession-key");
  const session = JSON.parse(sessionData);
  if (session) {
    try {
      await dbConnect();
      const urlData = await req.url.split("?");
      const id = urlData[1];
      const deleteAddress = await Address.findByIdAndDelete(id);
      return new Response(JSON.stringify(deleteAddress), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify(error.message), { status: 500 });
    }
  } else {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
}

export async function GET(req, params) {
  const sessionData = req.headers.get("x-mysession-key");
  const session = JSON.parse(sessionData);
  if (session) {
    let address_id = req.url.split("?");
    address_id = address_id[1];
    try {
      await dbConnect();
      const addressesData = await Address.findById(address_id);
      const obj1 = Object.assign(addressesData);
      const addresses = {
        addresses: obj1,
      };
      return new Response(JSON.stringify(addresses), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify(error.message), { status: 500 });
    }
  } else {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
}
