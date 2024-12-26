import Layout from "../../../layout/Layout";
import PageTitle from "../../../components/common/PageTitle";
import Dropdown from "../../../components/common/DropDown";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@material-tailwind/react";
import Moment from "moment";
import { useState, useEffect } from "react";
import { BaseUrl } from "../../../base/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DownloadCommon from "../../download/DeliveryDownload";

function MaterialReceipts() {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisableds, setIsButtonDisableds] = useState(false);

  const unit = [
    { value: "Kg", label: "Kg" },
    { value: "Ton", label: "Ton" },
  ];

  const manual = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "1",
      label: "Manual",
    },
  ];
  // Get the first and last date
  const todayback = Moment().format("YYYY-MM-DD");
  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  const [receiptsdwn, setPurchaseDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
    purchase_sub_item: "",
    purchase_sub_unit: "",
    m_manual_receipt_no: "",
  });

  // Input change handler for native inputs
  const onInputChange = (name, value) => {
    setPurchaseDownload({
      ...receiptsdwn,
      [name]: value,
    });
  };

  // Submit handler for download
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: receiptsdwn.receipt_from_date,
      receipt_to_date: receiptsdwn.receipt_to_date,
      purchase_sub_item: receiptsdwn.purchase_sub_item,
      purchase_sub_unit: receiptsdwn.purchase_sub_unit,
      m_manual_receipt_no: receiptsdwn.m_manual_receipt_no,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: BaseUrl + "/download-material-receipt",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "receipt_material_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Receipt Material is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Receipt Material is Not Downloaded");
          console.error("Download error:", err.response);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };
  //SUBMIT HAANDLE FOR DOWLOAD DETAILS
  const onSubmit1 = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: receiptsdwn.receipt_from_date,
      receipt_to_date: receiptsdwn.receipt_to_date,
      purchase_sub_item: receiptsdwn.purchase_sub_item,
      purchase_sub_unit: receiptsdwn.purchase_sub_unit,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      setIsButtonDisableds(true);

      axios({
        url: BaseUrl + "/download-detail-material-receipt",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "receipt_material_detail_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Receipt Material Detail is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Receipt Material Detail is Not Downloaded");
          console.error("Download error:", err.response);
        })
        .finally(() => {
          setIsButtonDisableds(false);
        });
    }
  };

  // Fetch item data
  const [item, setItem] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    fetch(BaseUrl + "/fetch-item", requestOptions)
      .then((response) => response.json())
      .then((data) => setItem(data.item));
  }, []);

  return (
    <Layout>
      <DownloadCommon />
      <ToastContainer />
      <div className="mt-4 mb-6">
        <PageTitle title={"Download Material Receipts"} />
      </div>
      <Card className="p-4">
        <h3 className="text-red-500 mb-5">
          Leave blank if you want all records.
        </h3>

        <form id="dowRecp" autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="w-full">
              <Input
                required
                type="date"
                label="From Date"
                name="receipt_from_date"
                className="required"
                value={receiptsdwn.receipt_from_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Input
                required
                type="date"
                label="To Date"
                className="required"
                name="receipt_to_date"
                value={receiptsdwn.receipt_to_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Item"
                className="required"
                name="purchase_sub_item"
                value={receiptsdwn.purchase_sub_item}
                options={item.map((item) => ({
                  value: item.item_name,
                  label: item.item_name,
                }))}
                onChange={(value) => onInputChange("purchase_sub_item", value)}
              />
            </div>

            <div className="w-full">
              <Dropdown
                label="Unit"
                className="required"
                name="purchase_sub_unit"
                value={receiptsdwn.purchase_sub_unit}
                options={unit.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(value) => onInputChange("purchase_sub_unit", value)}
              />
            </div>

            <div className="w-full">
              <Dropdown
                label="Manual Receip"
                className="required"
                name="m_manual_receipt_no"
                value={receiptsdwn.m_manual_receipt_no}
                options={manual.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(value) => onInputChange("purchase_sub_unit", value)}
              />
            </div>

            <div className="w-77">
              <Button
                color="blue"
                fullWidth
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Downloading..." : "Download"}
              </Button>
            </div>
            <div className="w-77">
              <Button
                color="blue"
                fullWidth
                onClick={onSubmit1}
                disabled={isButtonDisableds}
              >
                {isButtonDisableds
                  ? "Downloading Details..."
                  : "Download Details"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </Layout>
  );
}

export default MaterialReceipts;
