import string


class TcpPackConstructor:
    head_cnt=0
    need_buflen=0
    cur_buflen=0
    buf=''
    def handle_slice(self,slice1:string):
        anlyzed2=0; #已经分析了的
        while anlyzed2<len(slice1):
            leftlen=len(slice1)-anlyzed2
            if self.head_cnt<4:
                head_need_cnt=4-self.head_cnt
                if(len(slice1)<head_need_cnt):
                    
