import string

MsgPackHeadSize = 4


class TcpPackConstructor:
    head_cnt = 0
    head_rec_cnt = 0
    body_rec_cnt = 0
    # need_buflen = 0
    cur_buflen = 0
    body_buf = []
    head_buf = ['_' for n in range(MsgPackHeadSize)]
    packlen = 0
    cb = None

    # 回调处理的参数为byte串
    def set_detahandle_callback(self, cb):
        self.cb = cb

    # 处理一段数据流
    def handle_slice(self, buffset: list):
        handled_offset = 0;  # 已经分析了的
        _byte_cnt = len(buffset);
        while handled_offset < _byte_cnt:
            byte_cnt_left = _byte_cnt - handled_offset;
            # 头未接收全
            if self.head_rec_cnt < MsgPackHeadSize:
                if byte_cnt_left + self.head_rec_cnt < MsgPackHeadSize:
                    # 不够接收头
                    for i in range(0, byte_cnt_left):
                        self.head_buf[self.head_rec_cnt + i] = buffset[handled_offset+i]
                    self.head_rec_cnt += byte_cnt_left
                else:
                    # 足够接收头
                    cpylen = MsgPackHeadSize - self.head_rec_cnt;
                    for i in range(0, cpylen):
                        self.head_buf[(self.head_rec_cnt + i)] = \
                            buffset[handled_offset + i];
                    handled_offset += (MsgPackHeadSize - self.head_rec_cnt);
                    self._calc_pack_head();
                    self.head_rec_cnt = MsgPackHeadSize;
                    # // 扩大缓冲区
                    if self.packlen > len(self.body_buf):
                        self.body_buf.extend(
                            ['_' for n in range(self.packlen - len(self.body_buf))])
            else:
                # 头已收完，收数据体
                if byte_cnt_left < (self.packlen - self.body_rec_cnt):
                    # // 1.剩余数据小于需要读的字节数量(不够
                    self._write_data_2_body(buffset[handled_offset:], byte_cnt_left);
                    return;
                else:
                    # // 可以完成读包

                    len1 = self.packlen - self.body_rec_cnt;
                    self._write_data_2_body(buffset[handled_offset:], len1);
                    handled_offset += len1;

                    if self.cb != None:
                        # 获取body数据切片，传入callback
                        self.cb(self.body_buf[:self.packlen])
                    # // 对包进行解析

                    self._reset_states();

    def _calc_pack_head(self):
        self.packlen = int.from_bytes(self.head_buf,byteorder='big',signed=False)
        # print('packlen:',self.packlen)

    def _write_data_2_body(self, buf: list, cnt: int):
        for i in range(0, cnt):
            self.body_buf[self.body_rec_cnt + i] = (buf[i]);

    def _reset_states(self):
        self.head_rec_cnt = 0;
        self.body_rec_cnt = 0;
