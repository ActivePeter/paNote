use std::time::{SystemTime, UNIX_EPOCH};

pub fn time_stamp_ms_u64()->u64{
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as u64
}